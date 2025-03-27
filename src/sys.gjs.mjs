//**************************************************************************************************
/**
 * @file System classes for Gnome JavaScript (GJS) javascript engine.
 *
 * **Created**: 2025.01.11
 *
 * @module sys-gjs
 * @version 1.0.0
 * @author freethread-it
 * @copyright 2025 freethread-it
 * @license BSD 2-Clause "Simplified" license
 * Copyright (c) 2025 freethread-it
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted
 * provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions
 *    and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
 * WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those of the author
 * and should not be interpreted as representing official policies, either expressed or implied, of
 * the author.
 */
//--------------------------------------------------------------------------------------------------
import GLib from "gi://GLib";
import Gio from "gi://Gio";
import { SystemBase } from "./sys-common.mjs";


////////////////////////////////////////////////////////////////////////////////////////////////////
//
// EXPORTS
//
////////////////////////////////////////////////////////////////////////////////////////////////////
export { System };


////////////////////////////////////////////////////////////////////////////////////////////////////
//
// CLASSES
//
////////////////////////////////////////////////////////////////////////////////////////////////////


//==================================================================================================
/**
 * System class definition.
 */
//--------------------------------------------------------------------------------------------------
class System extends SystemBase
{
	/** Construct and initialize the object. */
	constructor ()
	{
		super ();
	}

	/*----------------------------------------------------------------------------------------------
	 * Properties
	 *--------------------------------------------------------------------------------------------*/

	/** @property {String} [#sOSID = ""] - ID of the Operating System.
	 * @private */
	#sOSID = "";

	/** @property {String} [#sOSName = ""] - Name of the Operating System.
	 * @private */
	#sOSName = "";

	/** @property {String} [#sOSVersion = ""] - Version of the Operating System.
	 * @private */
	#sOSVersion = "";

	/** @property {String} [#sOSArchitecture = ""] - Architecture of the Operating System.
	 * @private */
	#sOSArchitecture = "";

	// Current user --------------------------------------------------------------------------------

	/** @property {String} [#sUserName = ""] - Current user name.
	 * @private */
	#sUserName = "";

	/** @property {Number} [iUserID = -1] - Current user id.
	 * @private */
	#iUserID = -1;

	/** @property {String} [sUserHomeDir = ""] - Current user home path.
	 * @private */
	#sUserHomeDir = "";

	/*----------------------------------------------------------------------------------------------
	 * Getters and Setters
	 *--------------------------------------------------------------------------------------------*/

	/** Get the Operating System ID.
	 * @type {String}
	 * @readonly */
	get osID ()
	{
		if (this.#sOSID == "")
		{
			this.#sOSID = GLib.get_os_info ("ID");
			if (this.#sOSID === null) this.#sOSID = "Undefined";
		}
		return this.#sOSID;
	}

	/** Get the Operating System name.
	 * @type {String}
	 * @readonly */
	get osName ()
	{
		if (this.#sOSName == "")
		{
			this.#sOSName = GLib.get_os_info ("NAME");
			if (this.#sOSName === null) this.#sOSName = "Undefined";
		}
		return this.#sOSName;
	}

	/** Get the Operating System version.
	 * @type {String}
	 * @readonly */
	get osVersion ()
	{
		if (this.#sOSVersion == "")
		{
			this.#sOSVersion = GLib.get_os_info ("VERSION");
			if (this.#sOSVersion === null) this.#sOSVersion = "Undefined";
		}
		return this.#sOSVersion;
	}

	/** Get the Operating System architecture.
	 * @type {String}
	 * @readonly */
	get osArchitecture ()
	{
		if (this.#sOSArchitecture == "")
		{
			this.#sOSArchitecture = this.execCommandSync ("uname -m");
			if (this.#sOSArchitecture === null) this.#sOSArchitecture = "Undefined";
		}
		return this.#sOSArchitecture;
	}

	// Current user --------------------------------------------------------------------------------

	/** Get the current user name.
	 * @type {String}
	 * @readonly */
	get userName ()
	{
		if (this.#sUserName == "") this.#sUserName = GLib.get_user_name ();
		return this.#sUserName;
	}

	/** Get the current user ID.
	 * @type {Number}
	 * @readonly */
	get userID ()
	{
		if (this.#iUserID == -1) this.#iUserID = GLib.get_user_id ();
		return this.#iUserID;
	}

	/** Get the current user home path.
	 * @type {String}
	 * @readonly */
	get userHomeDir ()
	{
		if (this.#sUserHomeDir == "") this.#sUserHomeDir = GLib.get_home_dir ();
		return this.#sUserHomeDir;
	}

	/*----------------------------------------------------------------------------------------------
	 * Methods
	 *--------------------------------------------------------------------------------------------*/

	// Environment ---------------------------------------------------------------------------------

	/** Get environment variable value.
	 * @param {String} sVariable - Name of the environment variable to get.
	 * @param {String} [sDefault = ""] - Default value if the variable is not defined.
	 * @returns {String} The value of the variable queried. */
	getEnvVar (sVariable, sDefault = "")
	{
		var sValue = GLib.getenv (sVariable);
		if (sValue === null) sValue = sDefault;
		return sValue;
	}

	// Subprocesses --------------------------------------------------------------------------------

	/** Execute a synchronous command and returns the `stdout` result.
	 * @param {Array.<String>} aCommand - The command line to execute (command and arguments in an
	 * array).
	 * @returns {Array.<Any>} Returns and array of the following values:
	 * - {Boolean} bResult - The success of the execution, if `true` the command was successful
	 *   executed, otherwise `false`.
	 * - {Number} iExitStatus - The exit status of the command.
	 * - {String} sStdOut - The standard output of the command.
	 * - {String} sStdErr - The standard error of the command. */
	execCommandSync (aCommand)
	{
		var aResult = [ false, -1, "", "" ];
		try
		{
			var oSubprocess = Gio.Subprocess.new (aCommand, Gio.SubprocessFlags.STDOUT_PIPE |
												  Gio.SubprocessFlags.STDERR_PIPE);
			if (oSubprocess.wait (null))
			{
				var iExitStatus = oSubprocess.get_exit_status ();
				var [ bResult, sStdout, sStderr ] = oSubprocess.communicate_utf8 (null, null);
				if (bResult)
				{
					aResult = [ bResult,
								iExitStatus,
								sStdout.trim (),
								sStderr.trim () ];
				}
			}
		}
		catch (e)
		{
			console.error (e);
		}
		return aResult;
	}

	// File System ---------------------------------------------------------------------------------

	/** Check if path exists and is a file.
	 * @param {String} sPath - The full path name of the file to check if exists.
	 * @returns {Boolean} Returns `true` if the file exists, otherwise returns `false`. */
	fileExists (sPath)
	{
		try
		{
			var oFile = Gio.File.new_for_path (sPath);
			if (oFile.query_exists (null))
			{
				var oFileInfo = oFile.query_info ("standard::type", Gio.FileQueryInfoFlags.NONE,
												  null);
				var eFileType = oFileInfo.get_file_type ();
				if (eFileType == Gio.FileType.REGULAR) return true;
			}
		}
		catch (e) {}
		return false;
	}

	/** Check if path exists and is a directory .
	 * @param {String} sPath - The full path name of the directory to check if exists.
	 * @returns {Boolean} Returns `true` if the directory exists, otherwise returns `false`. */
	directoryExists (sPath)
	{
		try
		{
			var oFile = Gio.File.new_for_path (sPath);
			if (oFile.query_exists (null))
			{
				var oFileInfo = oFile.query_info ("standard::type", Gio.FileQueryInfoFlags.NONE,
												  null);
				var eFileType = oFileInfo.get_file_type ();
				if (eFileType == Gio.FileType.DIRECTORY) return true;
			}
		}
		catch (e) {}
		return false;
	}

	/** Read a text file and returns its content.
	 * @param {String} sPath - The full path name of the file to read.
	 * @returns {(String | null)} If the file successful readed returns its content, otherwise
	 * returns `null`. */
	readFileSync (sPath)
	{
		if (this.fileExists (sPath) == true)
		{
			try
			{
				var oFile = Gio.File.new_for_path (sPath);
				var [ bResult, sText, sETag ] = oFile.load_contents (null);
				if (bResult)
				{
					var oTextDecoder = new TextDecoder ("UTF-8");
					return oTextDecoder.decode (sText);
				}
			}
			catch (e) {}
		}
		return null;
	}

	/** Write a text file, if the file does not exists it will be created, if exists it will be
	 * overwritten.
	 * @param {String} sPath - The full path name of the file to write.
	 * @param {String} sText - The content of the file to write.
	 * @returns {Boolean} If the function succeeded returns `true`, otherwise returns `false`. */
	writeFileSync (sPath, sText)
	{
		try
		{
			var oFile = Gio.File.new_for_path (sPath);
			var [bResult, sETag ] = oFile.replace_contents (sText, null, false,
															Gio.FileCreateFlags.REPLACE_DESTINATION,
															null);
			if (bResult) return true;
		}
		catch (e) {}
		return false;
	}
}
