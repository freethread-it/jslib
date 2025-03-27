//**************************************************************************************************
/**
 * @file System classes for Node javascript engine.
 *
 * **Created**: 2025.01.11
 *
 * @module sys-node
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
import OS from "node:os";
import Process from "node:process";
import SubProcess from "node:child_process";
import FileSystem from "node:fs";
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
		if (this.#sOSID == "") this.#sOSID = OS.platform;
		return this.#sOSID;
	}

	/** Get the Operating System name.
	 * @type {String}
	 * @readonly */
	get osName ()
	{
		if (this.#sOSName == "") this.#sOSName = OS.type ();
		return this.#sOSName;
	}

	/** Get the Operating System version.
	 * @type {String}
	 * @readonly */
	get osVersion ()
	{
		if (this.#sOSVersion == "") this.#sOSVersion = OS.release ();
		return this.#sOSVersion;
	}

	/** Get the Operating System architecture.
	 * @type {String}
	 * @readonly */
	get osArchitecture ()
	{
		if (this.#sOSArchitecture == "") this.#sOSArchitecture = OS.arch ();
		return this.#sOSArchitecture;
	}

	// Current user --------------------------------------------------------------------------------

	/** Get the current user name.
	 * @type {String}
	 * @readonly */
	get userName ()
	{
		if (this.#sUserName == "") this.#sUserName = OS.userInfo ().username;
		return this.#sUserName;
	}

	/** Get the current user ID.
	 * @type {Number}
	 * @readonly */
	get userID ()
	{
		if (this.#iUserID == -1) this.#iUserID = parseInt (OS.userInfo ().uid);
		return this.#iUserID;
	}

	/** Get the current user home path.
	 * @type {String}
	 * @readonly */
	get userHomeDir ()
	{
		if (this.#sUserHomeDir == "") this.#sUserHomeDir = OS.userInfo ().homedir;
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
		var sValue = Process.env[sVariable];
		if (sValue === null) sValue = sDefault;
		return sValue;
	}

	// Subprocesses --------------------------------------------------------------------------------

	/** Execute a synchronous command and returns the `stdout` result.
	 * @param {String} sCommand - The command line to execute (command and arguments).
	 * @returns {(String|null)} If the execution succeeded it returns a string containing the
	 * `stdout` result of the command, if an error occurred returns `null`.
	 * @example
	 * var sCmd = "uname -m";
	 * var sOut = System.execCmdSync (sCmd);
	 * if (sOut === null) console.error ("Error executing command '" + sCmd + "'");
	 * else console.log ("The result of the command is:\n" + sOut); */
	execCommandSync (sCommand)
	{
		/*
		try
		{
			return SubProcess.execSync (sCommand, { encoding: "UTF-8" });
		}
		catch (e) {}
		*/
		return null;
	}

	// File System ---------------------------------------------------------------------------------

	/** Check if path exists and is a file.
	 * @param {String} sPath - The full path name of the file to check if exists.
	 * @returns {Boolean} Returns `true` if the file exists, otherwise returns `false`. */
	fileExists (sPath)
	{
		try
		{
			var oStats = FileSystem.statSync (sPath);
			if (oStats.isFile ()) return true;
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
			var oStats = FileSystem.statSync (sPath);
			if (oStats.isDirectory ()) return true;
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
				return FileSystem.readFileSync (sPath, { encoding: "UTF-8" });
			}
			catch (e) {}
		}
		return null;
	}

	/** Write a text file, if the file not exists it will be created, if exists it will be
	 * overwritten.
	 * @param {String} sPath - The full path name of the file to write.
	 * @param {String} sText - The content of the file to write.
	 * @returns {Boolean} If the function succeeded returns `true`, otherwise returns `false`. */
	writeFileSync (sPath, sText)
	{
		try
		{
			FileSystem.writeFileSync (sPath, sText, { encoding: "UTF-8" });
			return true;
		}
		catch (e) {}
		return false;
	}
}

