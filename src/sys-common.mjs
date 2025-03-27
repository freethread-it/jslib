//**************************************************************************************************
/**
 * @file System classes common to JGS and Node javascript engines.
 *
 * **Created**: 2025.01.11
 *
 * @module sys-common
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


////////////////////////////////////////////////////////////////////////////////////////////////////
//
// EXPORTS
//
////////////////////////////////////////////////////////////////////////////////////////////////////
export { SystemBase };


/*//////////////////////////////////////////////////////////////////////////////////////////////////
 *
 * CLASSES
 *
 *////////////////////////////////////////////////////////////////////////////////////////////////*/


//==================================================================================================
/**
 * SystemBase class definition.
 */
//--------------------------------------------------------------------------------------------------
class SystemBase
{
	/** Construct and initialize the object. */
	constructor ()
	{}

	/*----------------------------------------------------------------------------------------------
	 * Methods
	 *--------------------------------------------------------------------------------------------*/

	// String maniputation -------------------------------------------------------------------------

	/** Split a string into array breaking at specifyied separator, removing adjacent separators and
	 * create an array also if the string does not contains separators (one item array). If the
	 * input string is empty, an ampty array will be created.
	 * @param {String} sText - The input string to split.
	 * @param {String} cSeparator - One character separator.
	 * @returns {Array.<String>} Return the resulting array. */
	splitString (sText, cSeparator)
	{
		var a = [];
		if ((typeof sText === "string") && (sText != ""))
		{
			if ((typeof cSeparator === "string") && (cSeparator != "") && (cSeparator.length == 1))
			{
				while (sText.length > 0)
				{
					var i = sText.indexOf (cSeparator);
					if (i >= 0)
					{
						a.push (sText.slice (0, i));
						sText = sText.slice (i + 1);
						// Remove consecutives separators
						while (sText.startsWith (cSeparator)) sText = sText.slice (1);
					}
					else
					{
						a.push (sText);
						sText = "";
					}
				}


				//a = sText.split (cSeparator);
				//if (a === "undefined") a[0] = sText;
			}
			else a[0] = sText;
		}
		return a;
	}

	/** Modify a strting for use inside an HTML markup text, replacing characters with HTML
	 * entities.
	 * @param {String} sText - The string to modify.
	 * @returns {String} Returns the modified string. */
	stringToMarkup (sText)
	{
		return sText.replace (/&/g, "&amp;")
					.replace (/</g, "&lt;")
					.replace (/>/g, "&gt;")
					.replace (/"/g, "&quot;")
					.replace (/'/g, "&apos;");
	}
}

