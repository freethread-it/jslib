//**************************************************************************************************
/**
 * @file Terminal classes.
 *
 * **Created**: 2025.05.03
 *
 * @module terminal
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


////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Classes
//
////////////////////////////////////////////////////////////////////////////////////////////////////

//==================================================================================================
/**
 * Terminal class definition.
 */
//--------------------------------------------------------------------------------------------------
class Terminal
{
	/** Construct and initialize the object. */
	constructor ()
	{}

	/*----------------------------------------------------------------------------------------------
	 * Properties
	 *--------------------------------------------------------------------------------------------*/

	/** @property {Boolean} [#bColor = false] - Flag that specify if using colors.
	 * @private */
	#bColor = false;

	/** @property {Boolean} [#bAttributes = false] - Flag that specify if using attributes (bold,
	 * italic and underline).
	 * @private */
	#bAttributes = false;

	/** @property {Boolean} [#bIcons = false] - Flag that specify if using font icons.
	 * @private */
	#bIcons = false;

	/*----------------------------------------------------------------------------------------------
	 * Getters and Setters
	 *--------------------------------------------------------------------------------------------*/

	/** Get/Set the color flag.
	 * @type {Boolean} */
	get isColor () { return this.#bColor; }
	set isColor (b) { this.#bColor = Boolean (b); }

	/** Get/Set the attributes flag.
	 * @type {Boolean} */
	get isAttributes () { return this.#bAttributes; }
	set isAttributes (b) { this.#bAttributes = Boolean (b); }

	/** Get/Set this font icons flag.
	 * @type {Boolean} */
	get isIcons () { return this.#bIcons; }
	set isIcons (b) { this.#bIcons = Boolean (b); }

	/*----------------------------------------------------------------------------------------------
	 * Methods
	 *--------------------------------------------------------------------------------------------*/
}


//==================================================================================================
/**
 * TermText class definition.
 */
//--------------------------------------------------------------------------------------------------
class TermText
{
	/** Construct and initialize the opbject. see [Terminal]{@link tutorial:Terminal} documentation
	 * for colors and attributes format.
	 * @param {String} sText - String of text.
	 * @param {TermColor} [oForegroundColor = null] - Foreground color.
	 * @param {TermColor} [oBackgroundColor = null] - Background color.
	 * @param {TermAttrs} [oAttributes = null] - Attributes. */
	constructor (sText, oForegroundColor = null, oBackgroundColor = null, oAttributes = null)
	{
		this.text = sText;
		this.colorFg = oForegroundColor;
		this.colorBg = oBackgroundColor;
		this.attrs = oAttributes;
	}

	/*----------------------------------------------------------------------------------------------
	 * Properties
	 *--------------------------------------------------------------------------------------------*/

	/** @property {String} [#sText = ""] - String text.
	 * @private */
	#sText = "";

	/** @property {TermColor} [#oColorFg = new TermColor ()] - Foreground color.
	 * @private */
	#oColorFg = new TermColor ();

	/** @property {TermColor} [#oColorBg = new TermColor ()] - Background color.
	 * @private */
	#oColorBg = new TermColor ();

	/** @property {TermAttr} [#oAttrs = new TermAttrs ()] - Attributes.
	 * @private */
	#oAttrs = new TermAttrs ();

	/*----------------------------------------------------------------------------------------------
	 * Getters and Setters
	 *--------------------------------------------------------------------------------------------*/

	/** Get/Set the text.
	 * @type {String} */
	get text () { return this.#sText; }
	set text (s) { this.#sText = s.toString (); }

	/** Get/Set the foreground color.
	 * @type {TermColor} */
	get colorFg () { return new TermColor (this.#oColorFg); }
	set colorFg (o) { if (o instanceof TermColor) this.#oColorFg.copy (o); }

	/** Get/Set the background color.
	 * @type {TermColor} */
	get colorBg () { return new TermColor (this.#oColorBg); }
	set colorBg (o) { if (o instanceof TermColor) this.#oColorBg.copy (o); }

	/** Get/Set the attributes.
	 * @type {TermAttrs} */
	get attrs () { return new TermAttrs (this.#oAttrs); }
	set attrs (o) { if (o instanceof TermAttrs) this.#oAttrs.copy (o); }

	/*----------------------------------------------------------------------------------------------
	 * Methods
	 *--------------------------------------------------------------------------------------------*/
}

//==================================================================================================
/**
 * TermColor class definition.
 */
//--------------------------------------------------------------------------------------------------
class TermColor
{
	/** Construct and initialize the object.
	 * @param {String} [sColor = ""] - Color. */
	constructor (sColor)
	{
		this.color = sColor;
	}

	/*----------------------------------------------------------------------------------------------
	 * Properties
	 *--------------------------------------------------------------------------------------------*/

	/** @property {String} [#sColor = ""] - Color.
	 * @private */
	#sColor = "";

	/*----------------------------------------------------------------------------------------------
	 * Getters and Setters
	 *--------------------------------------------------------------------------------------------*/

	/** Get/Set the color.
	 * @type {String} */
	get color () { return this.#sColor; }
	set color (s)
	{
		var sColor = s.toString ();
		if (sColor != "")
		{
			// Check if 16 colors format
			if (this.#checkColor16 (s)) this.setColor16 (s);
			else if (this.#chechColor256 (s)) this.setColor256 (s);
			else if (this.#checkColor16M (s)) this.setColor16M (s);
		}
	}

	/*----------------------------------------------------------------------------------------------
	 * Methods
	 *--------------------------------------------------------------------------------------------*/

	#checkColor16 (sColor)
	{
		return false;
	}
}
