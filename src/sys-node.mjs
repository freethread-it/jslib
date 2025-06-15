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
import Path from "node:path";
import Utilities from "node:util";
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

	// Proceess ------------------------------------------------------------------------------------

	/** @property {Array.<String>} [#aProcessArgs = null] - The process arguments on the command
	 * line.
	 * @private */
	#aProcessArgs = null;

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

	// Process -------------------------------------------------------------------------------------

	/** Get the process arguments on command line.
	 * @type {Array.<String>}
	 * @readonly */
	get processArgs ()
	{
		if (this.#aProcessArgs === null) this.#aProcessArgs = Process.argv.slice (2);
		return this.#aProcessArgs.slice ();
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
		if (typeof sValue === "undefined") sValue = sDefault;
		return sValue;
	}

	// Subprocesses --------------------------------------------------------------------------------

	/** Execute a synchronous command.
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
			var aCmd = aCommand.slice ();
			var sCommand = aCmd.shift ();
			var oResult = SubProcess.spawnSync (sCommand, aCmd, { encoding: "UTF-8" });
			var bResult = false;
			if (oResult.status == 0) bResult = true;
			var iExitStatus = oResult.status;
			var sStdOut = oResult.stdout;
			var sStdErr = oResult.stderr;
			aResult = [ bResult, iExitStatus, sStdOut, sStdErr ];
		}
		catch (e)
		{
			console.error (e);
		}
		return aResult;
	}

	/** Execute an asynchronous command.
	 * @param {Array.<String>} aCommand - The command line to execute (command and arguments in an
	 * array.
	 * @returns {Executor} If the function succeeded returns a command executor object, otherwise
	 * rise an exception error. */
	execCommandAsync (aCommand)
	{
		var oExecutor = new Executor ();
		oExecutor.execute (aCommand);
		return oExecutor;
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
		catch (e)
		{}
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
		catch (e)
		{}
		return false;
	}

	/** Get the directory name of the path.
	 * @param {String} sPath - Path to get the directory name.
	 * @returns {(String|null)} Returns the directory name of the path, if errors returns `null`. */
	dirName (sPath)
	{
		try
		{
			return Path.dirname (sPath);
		}
		catch (e)
		{}
		return null;
	}

	/** Get the base name of the path.
	 * @param {String} sPath - Path to get the base name.
	 * @returns {(String|null)} Returns the basse name of the path, if errors returns `null`. */
	baseName (sPath)
	{
		try
		{
			return Path.basename (sPath);
		}
		catch (e)
		{}
		return null;
	}

	/** Get the extension name of the path.
	 * @param {(String|null)} sPath - Path to get the extension name.
	 * @returns {(String|null)} Returns the extension name of the path, if errors returns `null`. */
	extName (sPath)
	{
		try
		{
			return Path.extname (sPath);
		}
		catch (e)
		{}
		return null;
	}

	/** Creeate a directory.
	 * @param {String} sPath - Full path of the directory to create.
	 * @param {Boolean} [bRecursive = false] - If `true` intermediate directories that doesn not
	 * exists will be created.
	 * @returns {Boolean} If the functiuon succeeded returns `true`, otherwise return `false`. */
	createDirectory (sPath, bRecursive = false)
	{
		try
		{
			var s = FileSystem.mkdirSync (sPath, { recursive: bRecursive });
			if (typeof s !== "undefined") return true;
		}
		catch (e)
		{}
		return false;
	}

	/** Read a text file and returns its content.
	 * @param {String} sPath - The full path name of the file to read.
	 * @returns {(String|null)} If the file successful readed returns its content, otherwise
	 * returns `null`. */
	readFileSync (sPath)
	{
		if (this.fileExists (sPath) == true)
		{
			try
			{
				return FileSystem.readFileSync (sPath, { encoding: "UTF-8" });
			}
			catch (e)
			{
				console.error (e);
			}
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
		catch (e)
		{
			console.error (e);
		}
		return false;
	}

	// String manipulation -------------------------------------------------------------------------

	/** Format a string in the same way of the `printf`-like function in other languages. The format
	 * specifiers are:
	 * - `%s`: String will be used to convert all values except `BigInt`, `Object` and `-0`.
	 *   `BigInt` values will be represented with an '`n`' and `Objects` that have no user defined
	 *   `toString` function are inspected using `node:util.inspect ()` with options `{ depth: 0,
	 *    colors: false, compact: 3 }`.
	 * - `%d`: `Number` will be used to convert all values except `BigInt` and `Symbol`.
	 * - `%i`: `parseInt (value, 10)` is used for all values except `BigInt` and `Symbol`.
	 * - `%f`: `parseFloat (value)` is used for all values expect `Symbol`.
	 * - `%j`: `JSON`. Replaced with the string '`[Circular]`' if the argument contains circular
	 *   references.
	 * - `%o`: `Object`. A string representation of an object with generic JavaScript object
	 *   formatting. Similar to `node:util.inspect ()` with options `{ showHidden: true, showProxy:
	 *   true }`. This will show the full object including non-enumerable properties and proxies.
	 * - `%O`: `Object`. A string representation of an object with generic JavaScript object
	 *   formatting. Similar to `util.inspect ()` without options. This will show the full object
	 *   not including non-enumerable properties and proxies.
	 * - `%c`: CSS. This specifier is ignored and will skip any CSS passed in.
	 * - `%%`: single percent sign ('`%`'). This does not consume an argument.
	 * @param {String} sFormat - The string containing format specifiers.
	 * @param {Array.<String>} [aArgs = []] - Array of arguments used as substitution.
	 * @returns {String} Returns the formatted string. */
	stringFormat (sFormat, aArgs = [])
	{
		aArgs.unshift (sFormat);
		return Utilities.format.apply (null, aArgs);
	}
}


//==================================================================================================
/**
 * Executor class definition.
 */
//--------------------------------------------------------------------------------------------------
class Executor
{
	/** Construct and initialize the object */
	constructor ()
	{}

	/*----------------------------------------------------------------------------------------------
	 * Properties
	 *--------------------------------------------------------------------------------------------*/

	/** @property {Boolean} [#bRunning = false] - Flag that specifies if the command is running.
	 * @private */
	#bRunning = false;
	/** @property {Number} [#iExitStatus = null] - Exit status code of the command.
	 * @private */
	#iExitStatus = null;
	/** @property {Array.<String>} [#aStdoutBuffer = []] - `stdout` text lines buffer.
	 * @private */
	#aStdoutBuffer = [];
	/** @property {Array.<String>} [#aStderrBuffer = []] - `stderr` text lines buffer.
	 * @private */
	#aStderrBuffer = [];
	/** @property {String} [#sStdoutChunk = ""] - `stdout` text chunk to insert into buffer.
	 * @private */
	#sStdoutChunk = "";
	/** @property {String} [#sStderrChunk = ""] - `stderr` text chunk to insert into buffer.
	 * @private */
	#sStderrChunk = "";
	/** @property {Number} [#iStdoutIndex = 0] - Index into `stdout` buffer.
	 * @private */
	#iStdoutIndex = 0;
	/** @property {Number} [#iStderrIndex = 0] - Index into `stderr` buffer.
	 * @private */
	#iStderrIndex = 0;
	/** @property {Function} [#fnOutputResolve = null] - Output resolve callback of the `Promise`
	 * object.
	 * @private */
	#fnOutputResolve = null;
	/** @property {Function} [#fnOutputReject = null] - Output reject callback of the `Promise`
	 * object.
	 * @private */
	#fnOutputReject = null;

	/*----------------------------------------------------------------------------------------------
	 * Getters and setters
	 *--------------------------------------------------------------------------------------------*/

	/** Check if the command is running.
	 * @type {Boolean}
	 * @readonly */
	get isRunning () { return this.#bRunning; }

	/** Get the exit status of the command.
	 * @type {Number}
	 * @readonly */
	get exitStatus () { return this.#iExitStatus; }

	/*----------------------------------------------------------------------------------------------
	 * Methods
	 *--------------------------------------------------------------------------------------------*/

	/** Execute a process.
	 * @param {Array.<String>} aCommand - Array of string of the command and arguments. */
	execute (aCommand)
	{
		// Initialize the object properties
		this.#bRunning = true;
		this.#iExitStatus = null;
		this.#aStdoutBuffer = [];
		this.#aStderrBuffer = [];
		this.#sStdoutChunk = "";
		this.#sStderrChunk = "";
		this.#iStdoutIndex = 0;
		this.#iStderrIndex = 0;
		// Separate command and arguments
		var aArgs = aCommand.slice ();
		var sCommand = aArgs.shift ();
		// Execute the command
		const process = SubProcess.spawn (sCommand, aArgs);
		// Set UTF-8 encodings for the output streams
		process.stdout.setEncoding ("utf8");
		process.stderr.setEncoding ("utf8");
		// `stdout` data event
		process.stdout.on ("data", (sChunk) => {
			// Concatenate current data chunk to the remainder of the previous chunk
			this.#sStdoutChunk += sChunk;
			// Split the chunk in lines and push them in the buffer except the last line if
			// not complete
			var aLines = this.#sStdoutChunk.split ("\n");
			this.#sStdoutChunk = aLines.pop ();
			this.#aStdoutBuffer.push (...aLines);
			// Notify the new output
			if (this.#fnOutputResolve) {
				this.#fnOutputResolve ();
				this.#fnOutputResolve = null;
			}
		});
		// `stderr` data event
		process.stderr.on ("data", (sChunk) => {
			// Concatenate current data chunk to the remainder of the previous chunk
			this.#sStderrChunk += sChunk;
			// Split the chunk in lines and push them in the buffer except the last line if
			// not complete
			var aLines = this.#sStderrChunk.split ("\n");
			this.#sStderrChunk = aLines.pop ();
			this.#aStderrBuffer.push (...aLines);
		});
		// Process termination event
		process.on ("close", (iExitCode) => {
			this.#bRunning = false;
			this.#iExitStatus = iExitCode;
			// Notify the end of the process
			if (this.#fnOutputResolve) {
				this.#fnOutputResolve ();
				this.#fnOutputResolve = null;
			}
		});
		// Process error event
		process.on ("error", (oError) => {
			this.#bRunning = false;
			// Notify the error
			if (this.#fnOutputReject) {
				this.#fnOutputReject (oError);
				this.#fnOutputReject = null;
			} else {
				console.error ("Errore nel processo: " + oError.message);
			}
		});
	}

	/** Get the next `stdout` line from the buffer if any.
	 * @returns {(String|null)} If there is a line available in the buffer returns it, otherwise
	 * returns `null`.
	 * @async */
	async getNextStdoutLine () {
		while (this.#iStdoutIndex >= this.#aStdoutBuffer.length)
		{
			// If the process is terminated there is nothing to read
			if (!this.#bRunning) return null;
			await new Promise ((fnResolve, fnReject) => {
				this.#fnOutputResolve = fnResolve;
				this.#fnOutputReject = fnReject;
			});
		}
		return this.#aStdoutBuffer[this.#iStdoutIndex++];
	}

	/** Get the next `stderr` line from the buffer if any.
	 * @returns {(String|null)} If there is a line available in the buffer returns it, otherwise
	 * returns `null`.
	 * @async */
	async getNextStderrLine () {
		while (this.#iStderrIndex >= this.#aStderrBuffer.length)
		{
			// If the process is terminated there is nothing to read
			if (!this.#bRunning) return null;
			await new Promise ((fnResolve, fnReject) => {
				this.#fnOutputResolve = fnResolve;
				this.#fnOutputReject = fnReject;
			});
		}
		return this.#aStderrBuffer[this.#iStderrIndex++];
	}
}
