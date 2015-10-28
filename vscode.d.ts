/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

declare namespace vscode {

	/**
	 * The command callback.
	 */
	export interface CommandCallback {

		/**
		 *
		 */
		<T>(...args:any[]):T | Thenable<T>;
	}

	export interface Command {
		title: string;
		command: string;
		arguments?: any[]|any;
	}

	export interface TextEditorOptions {
		tabSize: number;
		insertSpaces: boolean;
	}

	export class TextLine {

		getText(): string;

		isEmptyOrWhitespace(): boolean;

		getLeadingWhitespaceLength(): number;

		getRange(): Range;

		getRangeIncludingLineBreak(): Range;

		getStart(): Position;

		getEnd(): Position;

		getEndIncludingLineBreak(): Position;
	}


	export class TextDocument {

		constructor(uri: Uri, lines: string[], eol: string, languageId: string, versionId: number, isDirty:boolean);

		/**
		 * Get the associated URI for this document. Most documents have the file:// scheme, indicating that they represent files on disk.
		 * However, some documents may have other schemes indicating that they are not available on disk.
		 */
		getUri(): Uri;

		/**
		 * Returns the file system path of the file associated with this document. Shorthand
		 * notation for ```TextDocument.getUri().fsPath```
		 */
		getPath(): string;

		/**
		 * Is this document representing an untitled file.
		 */
		isUntitled(): boolean;

		isDirty(): boolean;

		save(): Thenable<boolean>;

		/**
		 * The language identifier associated with this document.
		 */
		getLanguageId(): string;

		/**
		 * The version number of this document (it will strictly increase after each change).
		 */
		getVersionId(): number;

		/**
		 * Get the entire text in this document.
		 */
		getText(): string;

		/**
		 * Get the text in a specific range in this document.
		 */
		getTextInRange(range: Range): string;

		/**
		 * Get the word under a certain position. May return null if position is at whitespace, on empty line, etc.
		 */
		getWordRangeAtPosition(position:Position): Range;

		/**
		 * Get the number of lines in this document.
		 */
		getLineCount(): number;

		/**
		 * Returns a text line denoted by the line number.
		 * @param lineNumber A line number from this interval [0,getLineCount()[
		 * @return A line.
		 */
		getLine(lineNumber: number): TextLine;

		/**
		 * Ensure a range sticks to the text.
		 */
		validateRange(range:Range): Range;

		/**
		 * Ensure a position sticks to the text.
		 */
		validatePosition(position:Position): Position;
	}

	export class Position {

		line: number;

		character: number;

		constructor(line: number, character: number);

		isBefore(other: Position): boolean;

		isBeforeOrEqual(other: Position): boolean;
	}

	export class Range {

		start: Position;

		end: Position;

		constructor(start: Position, end: Position);
		constructor(startLine: number, startColumn: number, endLine:number, endColumn:number);

		contains(positionOrRange: Position | Range): boolean;

		/**
		 * @return `true` iff `start` and `end` are equal
		 */
		isEmpty(): boolean;

		/**
		 * @return `true` iff start and end are on the same line
		 */
		isOneLine(): boolean;
	}

	export class Selection extends Range {

		anchor: Position;

		active: Position;

		constructor(anchor: Position, active: Position);
		constructor(anchorLine: number, anchorColumn: number, activeLine:number, activeColumn:number);

		isReversed(): boolean;
	}

	export class TextEditor {

		constructor(document: TextDocument, selections: Selection[], options: TextEditorOptions);

		/**
		 * Get the document associated with this text editor. The document will be the same for the entire lifetime of this text editor.
		 */
		getTextDocument(): TextDocument;

		/**
		 * Get the primary selection on this text editor. In case the text editor has multiple selections, the first one will be returned.
		 */
		getSelection(): Selection;

		/**
		 * Set the selection on this text editor.
		 */
		setSelection(value: Position | Range | Selection): Thenable<any>;

		/**
		 * Get the selections in this text editor.
		 */
		getSelections(): Selection[];

		/**
		 * Set the selections in this text editor.
		 */
		setSelections(value: Selection[]): Thenable<TextEditor>;

		/**
		 * Get text editor options.
		 */
		getOptions(): TextEditorOptions;

		/**
		 * Change text editor options.
		 */
		setOptions(options: TextEditorOptions): Thenable<TextEditor>;

		/**
		 * Perform an edit on the document associated with this text editor.
		 * The passed in {{editBuilder}} is available only for the duration of the callback.
		 */
		edit(callback:(editBuilder:TextEditorEdit)=>void): Thenable<boolean>;

	}

	/**
	 * A complex edit that will be applied on a TextEditor.
	 * This holds a description of the edits and if the edits are valid (i.e. no overlapping regions, etc.) they can be applied on a Document associated with a TextEditor.
	 */
	export interface TextEditorEdit {
		/**
		 * Replace a certain text region with a new value.
		 */
		replace(location: Position | Range | Selection, value: string): void;

		/**
		 * Insert text at a location
		 */
		insert(location: Position, value: string): void;

		/**
		 * Delete a certain text region.
		 */
		delete(location: Range | Selection): void;

	}

	/**
	 * A universal resource identifier representing either a file on disk on
	 * or another resource, e.g untitled.
	 */
	export class Uri {

		constructor();
		static parse(path: string): Uri;
		static file(path: string): Uri;
		static create(path: string): Uri;

		/**
		 * scheme is the 'http' part of 'http://www.msft.com/some/path?query#fragment'.
		 * The part before the first colon.
		 */
		scheme: string;


		/**
		 * authority is the 'www.msft.com' part of 'http://www.msft.com/some/path?query#fragment'.
		 * The part between the first double slashes and the next slash.
		 */
		authority: string;


		/**
		 * path is the '/some/path' part of 'http://www.msft.com/some/path?query#fragment'.
		 */
		path: string;

		/**
		 * query is the 'query' part of 'http://www.msft.com/some/path?query#fragment'.
		 */
		query: string;

		/**
		 * fragment is the 'fragment' part of 'http://www.msft.com/some/path?query#fragment'.
		 */
		fragment: string;

		/**
		 * Retuns a string representing the corresponding file system path of this URI.
		 * Will handle UNC paths and normalize windows drive letters to lower-case. Also
		 * uses the platform specific path separator. Will *not* validate the path for
		 * invalid characters and semantics. Will *not* look at the scheme of this URI.
		 */
		fsPath: string;

		/**
		 * Returns a canonical representation of this URI. The representation and normalization
		 * of a URI depends on the scheme.
		 */
		toString(): string;

		toJSON(): any;
	}

	export interface CancellationToken {
		isCancellationRequested: boolean;
		onCancellationRequested: Event<any>;
	}

	export class CancellationTokenSource {

		token: CancellationToken;

		cancel(): void;

		dispose(): void;
	}

	/**
	 * Represents a type which can release resources, such
	 * as event listening or a timer.
	 */
	export class Disposable {

		/**
		 * Combine many disposable-likes into one. Use this method
		 * when having objects with a dispose function which are not
		 * instances of Disposable.
		 *
		 * @return Returns a new disposable which, upon dispose, will
		 * dispose all provides disposable-likes.
		 */
		static from(...disposableLikes: { dispose: () => any }[]): Disposable;

		/**
		 * Creates a new Disposable calling the provided function
		 * on dispose
		 * @param callOnDispose Function that disposes something
		 */
		constructor(callOnDispose: Function);

		/**
		 * Dispose this object.
		 */
		dispose(): any;
	}

	/**
	 * Represents a typed event.
	 */
	export interface Event<T> {

		/**
		 *
		 * @param listener The listener function will be call when the event happens.
		 * @param thisArgs The 'this' which will be used when calling the event listener.
		 * @param disposables An array to which a {{IDisposable}} will be added. The
		 * @return
		 */
		(listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
	}

	/**
	 * A file system watcher notifies about changes to files and folders
	 * on disk. To get an instanceof of a {{FileSystemWatcher}} use
	 * {{workspace.createFileSystemWatcher}}.
	 */
	export interface FileSystemWatcher extends Disposable {

		/**
		 * Happens on file/folder creation.
		 */
		onDidCreate: Event<Uri>;

		/**
		 * Happens on file/folder change.
		 */
		onDidChange: Event<Uri>;

		/**
		 * Happens on file/folder deletion.
		 */
		onDidDelete: Event<Uri>;
	}

	/**
	 *
	 */
	export interface QuickPickOptions {
		/**
		* an optional flag to include the description when filtering the picks
		*/
		matchOnDescription?: boolean;

		/**
		* an optional string to show as place holder in the input box to guide the user what she picks on
		*/
		placeHolder?: string;
	}

	/**
	 *
	 */
	export interface QuickPickItem {
		label: string;
		description: string;
	}

	/**
	 *
	 */
	export interface InputBoxOptions {
		/**
		* The text to display underneath the input box.
		*/
		prompt?: string;

		/**
		* an optional string to show as place holder in the input box to guide the user what to type
		*/
		placeHolder?: string;
	}

	/**
	 *
	 */
	export interface LanguageFilter {
		language?: string;
		scheme?: string;
		pattern?: string;
	}

	/**
	 *
	 */
	export type LanguageSelector = string|LanguageFilter|(string|LanguageFilter)[];

	export interface CodeActionContext {
		diagnostics: Diagnostic[];
	}

	export interface CodeActionProvider {
		provideCodeActions(document: TextDocument, range: Range, context: CodeActionContext, token: CancellationToken): Command[] | Thenable<Command[]>;
	}

	/**
	 *
	 */
	export class CodeLens {
		range: Range;
		command: Command;
		constructor(range: Range);
	}

	/**
	 *
	 */
	export interface CodeLensProvider {

		/**
		 *
		 */
		provideCodeLenses(document: TextDocument, token: CancellationToken): CodeLens[] | Thenable<CodeLens[]>;

		/**
		 *
		 */
		resolveCodeLens?(codeLens: CodeLens, token: CancellationToken): any | Thenable<any>;
	}

	export type Definition = Location | Location[];

	export interface DefinitionProvider {
		provideDefinition(document: TextDocument, where: Position, token: CancellationToken): Definition | Thenable<Definition>;
	}

	export class Hover {

		content: vscode.IHTMLContentElement;

		range: Range;

		constructor(value: string | vscode.IHTMLContentElement, range?: Range);
	}

	export interface HoverProvider {
		provideHover(document: TextDocument, position: Position, token: CancellationToken): Hover | Thenable<Hover>;
	}

	export enum DocumentHighlightKind {
		Text,
		Read,
		Write
	}

	export class DocumentHighlight {
		constructor(range: Range, kind?: DocumentHighlightKind);
		range: Range;
		kind: DocumentHighlightKind;
	}

	export interface DocumentHighlightProvider {
		provideDocumentHighlights(document: TextDocument, position: Position, token: CancellationToken): DocumentHighlight[] | Thenable<DocumentHighlight[]>;
	}

	export enum SymbolKind {
		File,
		Module,
		Namespace,
		Package,
		Class,
		Method,
		Property,
		Field,
		Constructor,
		Enum,
		Interface,
		Function,
		Variable,
		Constant,
		String,
		Number,
		Boolean,
		Array,
	}

	export class SymbolInformation {
		constructor(name: string, kind: SymbolKind, range: Range, uri?: Uri, containerName?: string);
		name: string;
		containerName: string;
		kind: SymbolKind;
		location: Location;
	}

	export interface DocumentSymbolProvider {
		provideDocumentSymbols(document: TextDocument, token: CancellationToken): SymbolInformation[] | Thenable<SymbolInformation[]>;
	}

	export interface WorkspaceSymbolProvider {
		provideWorkspaceSymbols(query: string, token: CancellationToken): SymbolInformation[] | Thenable<SymbolInformation[]>;
	}

	export interface ReferenceProvider {
		provideReferences(document: TextDocument, position: Position, options: { includeDeclaration: boolean; }, token: CancellationToken): Location[] | Thenable<Location[]>;
	}

	export class TextEdit {
		static replace(range: Range, newText: string): TextEdit;
		static insert(position: Position, newText: string): TextEdit;
		static delete(range: Range): TextEdit;
		constructor(range: Range, newText: string);
		range: Range;
		newText: string;
	}

	export class WorkspaceEdit {
		size: number;
		replace(resource: Uri, range: Range, newText: string): void;
		insert(resource: Uri, range:Position, newText:string): void;
		delete(resource: Uri, range: Range): void;
		edits(): [Uri, TextEdit[]][];
	}

	/**
	 *
	 */
	export interface RenameProvider {
		provideRenameEdits(document: TextDocument, position: Position, newName: string, token: CancellationToken): WorkspaceEdit | Thenable<WorkspaceEdit>;
	}

	export interface FormattingOptions {
		tabSize: number;
		insertSpaces: boolean;
		[key: string]: boolean | number | string;
	}

	/**
	 *
	 */
	export interface DocumentFormattingEditProvider {
		provideDocumentFormattingEdits(document: TextDocument, options: FormattingOptions, token: CancellationToken): TextEdit[] | Thenable<TextEdit[]>;
	}

	/**
	 *
	 */
	export interface DocumentRangeFormattingEditProvider {
		provideDocumentRangeFormattingEdits(document: TextDocument, range: Range, options: FormattingOptions, token: CancellationToken): TextEdit[] | Thenable<TextEdit[]>;
	}

	/**
	 *
	 */
	export interface OnTypeFormattingEditProvider {
		provideOnTypeFormattingEdits(document: TextDocument, position: Position, ch: string, options: FormattingOptions, token: CancellationToken): TextEdit[] | Thenable<TextEdit[]>;
	}

	export class ParameterInformation {
		label: string;
		documentation: string;
		constructor(label: string, documentation?: string);
	}

	export class SignatureInformation {
		label: string;
		documentation: string;
		parameters: ParameterInformation[];
		constructor(label: string, documentation?: string);
	}

	export class SignatureHelp {
		signatures: SignatureInformation[];
		activeSignature: number;
		activeParameter: number;
	}

	export interface SignatureHelpProvider {
		provideSignatureHelp(document: TextDocument, position: Position, token: CancellationToken): SignatureHelp | Thenable<SignatureHelp>;
	}

	export enum CompletionItemKind {
		Text,
		Method,
		Function,
		Constructor,
		Field,
		Variable,
		Class,
		Interface,
		Module,
		Property,
		Unit,
		Value,
		Enum,
		Keyword,
		Snippet,
		Color,
		File,
		Reference
	}

	export class CompletionItem {
		label: string;
		kind: CompletionItemKind;
		detail: string;
		documentation: string;
		sortText: string;
		filterText: string;
		insertText: string;
		textEdit: TextEdit;
		constructor(label: string);
	}

	export interface CompletionItemProvider {
		provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken): CompletionItem[] | Thenable<CompletionItem[]>;
		resolveCompletionItem?(item: CompletionItem, token: CancellationToken): CompletionItem | Thenable<CompletionItem>;
	}

	/**
	 *
	 */
	export interface ReadOnlyMemento {

		/**
		 * @param key The name of a property to read.
		 * @param defaultValue The default value in case the denoted property doesn't exists.
		 * @return
		 */
		getValue<T>(key: string, defaultValue?: T): Thenable<T>;

		/**
		 *
		 */
		getValues<T>(defaultValue?: T): Thenable<T>;
	}

	/**
	 *
	 */
	export interface Memento extends ReadOnlyMemento {
		setValue(key: string, value: any): Thenable<void>;
	}

	/**
	 * Represents the severity of diagnostics.
	 */
	export enum DiagnosticSeverity {
		Hint = 3,
		Information = 2,
		Warning = 1,
		Error = 0
	}

	/**
	 * Represents a location inside a resource, such as a line
	 * inside a text file.
	 */
	export class Location {
		constructor(uri: Uri, range: Range | Position);
		uri: Uri;
		range: Range;
	}

	export interface DiagnosticCollection {

		/**
		 *
		 */
		name: string;

		/**
		 * Assign resource for given resource
		 */
		set(uri: Uri, diagnostics?: Diagnostic[]): Thenable<void>;

		/**
		 * Replace all entries
		 */
		set(entries: [Uri, Diagnostic[]][]): Thenable<void>;

		/**
		 * Remove all diagnostics from this collection
		 */
		clear(): Thenable<void>;

		dispose(): void;
	}

	/**
	 * Represents a diagnostic, such as a compiler error or warning, along with the location
	 * in which they occurred.
	 */
	export class Diagnostic {

		range: Range;
		message: string;
		severity: DiagnosticSeverity;
		code: string | number;

		constructor(range: Range, message: string, severity?: DiagnosticSeverity);
	}

	export interface OutputChannel {
		append(value: string): void;
		appendLine(value: string): void;
		clear(): void;
		reveal(): void;
	}

	export interface ExecutionOptions {
		cwd?: string;
		env?: { [name: string]: any };
	}

	export interface TextEditorSelectionChangeEvent {
		textEditor: TextEditor;
		selections: Selection[];
	}

	export interface TextEditorOptionsChangeEvent {
		textEditor: TextEditor;
		options: TextEditorOptions;
	}

	export interface ITelemetryInfo {
		sessionId: string;
		machineId: string;
		instanceId: string;
	}

		/**
	 * Namespace for commanding
	 */
	export namespace commands {

		/**
		 * Registers a command that can be invoked via a keyboard shortcut,
		 * an menu item, an action, or directly.
		 *
		 * @param command - The unique identifier of this command
		 * @param callback - The command callback
		 * @param thisArgs - (optional) The this context used when invoking {{callback}}
		 * @return Disposable which unregisters this command on disposal
		 */
		export function registerCommand(command: string, callback: CommandCallback, thisArg?: any): Disposable;

		/**
		 * Register a text editor command that will make edits.
		 * It can be invoked via a keyboard shortcut, a menu item, an action, or directly.
		 *
		 * @param command - The unique identifier of this command
		 * @param callback - The command callback. The {{textEditor}} and {{edit}} passed in are available only for the duration of the callback.
		 * @param thisArgs - (optional) The `this` context used when invoking {{callback}}
		 * @return Disposable which unregisters this command on disposal
		 */
		export function registerTextEditorCommand(command: string, callback: (textEditor:TextEditor, edit:TextEditorEdit) => void, thisArg?: any): Disposable;

		/**
		 * Executes a command
		 *
		 * @param command - Identifier of the command to execute
		 * @param ...rest - Parameter passed to the command function
		 * @return
		 */
		export function executeCommand<T>(command: string, ...rest: any[]): Thenable<T>;

		/**
		 * Retrieve the list of all avialable commands.
		 *
		 * @return Thenable that resolves to a list of command ids.
		 */
		export function getCommands(): Thenable<string[]>;
	}

	export namespace window {

		export let activeTextEditor: TextEditor;

		export const onDidChangeActiveTextEditor: Event<TextEditor>;

		export const onDidChangeTextEditorSelection: Event<TextEditorSelectionChangeEvent>;

		export const onDidChangeTextEditorOptions: Event<TextEditorOptionsChangeEvent>;

		export function showInformationMessage(message: string, ...commands: { title: string; command: string | CommandCallback; }[]): Thenable<void>;

		export function showWarningMessage(message: string, ...commands: { title: string; command: string | CommandCallback; }[]): Thenable<void>;

		export function showErrorMessage(message: string, ...commands: { title: string; command: string | CommandCallback; }[]): Thenable<void>;

		export function setStatusBarMessage(message: string, hideAfterMillis?: number): Disposable;

		export function showQuickPick(items: string[], options?: QuickPickOptions): Thenable<string>;

		export function showQuickPick<T extends QuickPickItem>(items: T[], options?: QuickPickOptions): Thenable<T>;

		/**
		 * Opens an input box to ask the user for input.
		 *
		 * The returned value will be undefined if the input box was canceled (e.g. pressing ESC) and otherwise will
		 * have the user typed string or an empty string if the user did not type anything but dismissed the input
		 * box with OK.
		 */
		export function showInputBox(options?: InputBoxOptions): Thenable<string>;

		/**
		 * Returns a new output channel with the given name
		 */
		export function createOutputChannel(name: string): OutputChannel;
	}

	/**
	 * An event describing a change in the text of a model.
	 */
	export interface TextDocumentContentChangeEvent {
		/**
		 * The range that got replaced.
		 */
		range: Range;
		/**
		 * The length of the range that got replaced.
		 */
		rangeLength: number;
		/**
		 * The new text for the range.
		 */
		text: string;
	}

	export interface TextDocumentChangeEvent {
		document: TextDocument;
		contentChanges: TextDocumentContentChangeEvent[];
	}

	// TODO@api in the future there might be multiple opened folder in VSCode
	// so that we shouldn't make broken assumptions here
	export namespace workspace {

		/**
		 * Creates a file system watcher. A glob pattern that filters the
		 * file events must be provided. Optionally, flags to ignore certain
		 * kind of events can be provided.
		 *
		 * @param globPattern - A glob pattern that is applied to the names of created, changed, and deleted files.
		 * @param ignoreCreateEvents - Ignore when files have been created.
		 * @param ignoreChangeEvents - Ignore when files have been changed.
		 * @param ignoreDeleteEvents - Ignore when files have been deleted.
		 */
		export function createFileSystemWatcher(globPattern: string, ignoreCreateEvents?: boolean, ignoreChangeEvents?: boolean, ignoreDeleteEvents?: boolean): FileSystemWatcher;

		// TODO@api - justify this being here
		export function getPath(): string;

		export function getRelativePath(pathOrUri: string|Uri): string;

		// TODO@api - justify this being here
		export function findFiles(include: string, exclude: string, maxResults?:number): Thenable<Uri[]>;

		/**
		 * save all dirty files
		 */
		export function saveAll(includeUntitled?: boolean): Thenable<boolean>;

		export function getTextDocuments(): TextDocument[];
		export function getTextDocument(resource: Uri): TextDocument;
		export const onDidOpenTextDocument: Event<TextDocument>;
		export const onDidCloseTextDocument: Event<TextDocument>;
		export const onDidChangeTextDocument: Event<TextDocumentChangeEvent>;
		export const onDidSaveTextDocument: Event<TextDocument>;
	}

	export namespace languages {

		/**
		 * Return the identifiers of all known languages.
		 * @return Promise resolving to an array of identifier strings.
		 */
		export function getLanguages(): Thenable<string[]>;

		/**
		 *
		 */
		export function createDiagnosticCollection(name?: string): DiagnosticCollection;

		/**
		 *
		 */
		export function addInformationLanguageStatus(language: LanguageSelector|Uri|Uri[], message: string | { octicon: string; message: string;}, command: string | CommandCallback): Disposable;

		/**
		 *
		 */
		export function addWarningLanguageStatus(language: LanguageSelector | Uri | Uri[], message: string | { octicon: string; message: string; }, command: string | CommandCallback): Disposable;

		/**
		 *
		 */
		export function addErrorLanguageStatus(language: LanguageSelector | Uri | Uri[], message: string | { octicon: string; message: string; }, command: string | CommandCallback): Disposable;

		/**
		 *
		 */
		export function registerCodeActionsProvider(language: LanguageSelector, provider: CodeActionProvider): Disposable;

		/**
		 *
		 */
		export function registerCodeLensProvider(language: LanguageSelector, provider: CodeLensProvider): Disposable;

		/**
		 *
		 */
		export function registerDefinitionProvider(selector: LanguageSelector, provider: DefinitionProvider): Disposable;

		/**
		 *
		 */
		export function registerHoverProvider(selector: LanguageSelector, provider: HoverProvider): Disposable;

		/**
		 *
		 */
		export function registerDocumentHighlightProvider(selector: LanguageSelector, provider: DocumentHighlightProvider): Disposable;

		/**
		 *
		 */
		export function registerDocumentSymbolProvider(selector: LanguageSelector, provider: DocumentSymbolProvider): Disposable;

		/**
		 *
		 */
		export function registerWorkspaceSymbolProvider(provider: WorkspaceSymbolProvider): Disposable;

		/**
		 *
		 */
		export function registerReferenceProvider(selector: LanguageSelector, provider: ReferenceProvider): Disposable;

		/**
		 *
		 */
		export function registerRenameProvider(selector: LanguageSelector, provider: RenameProvider): Disposable;

		/**
		 *
		 */
		export function registerDocumentFormattingEditProvider(selector: LanguageSelector, provider: DocumentFormattingEditProvider): Disposable;

		/**
		 *
		 */
		export function registerDocumentRangeFormattingEditProvider(selector: LanguageSelector, provider: DocumentRangeFormattingEditProvider): Disposable;

		/**
		 *
		 */
		export function registerOnTypeFormattingEditProvider(selector: LanguageSelector, provider: OnTypeFormattingEditProvider, firstTriggerCharacter:string, ...moreTriggerCharacter:string[]): Disposable;

		/**
		 *
		 */
		export function registerSignatureHelpProvider(selector: LanguageSelector, provider: SignatureHelpProvider, ...triggerCharacters: string[]): Disposable;

		/**
		 *
		 */
		export function registerCompletionItemProvider(selector: LanguageSelector, provider: CompletionItemProvider, ...triggerCharacters: string[]): Disposable;
	}

	export namespace extensions {

		export function getStateMemento(extensionId: string, global?: boolean): Memento;

		// TODO: Remove Memento from method name
		// TODO: Make method synchronous, stop using ReadOnlyMemento
		// dirkb: why is that here at all. IMO the configuration belongs to the workspace and not to the extnsion
		export function getConfigurationMemento(extensionId: string): ReadOnlyMemento;

		// TODO: send out the new config?
		export const onDidChangeConfiguration: Event<void>;

		export function getExtension(extensionId: string): any;

		export function getTelemetryInfo(): Thenable<ITelemetryInfo>;
	}

	export interface IHTMLContentElement {
		formattedText?:string;
		text?: string;
		className?: string;
		style?: string;
		customStyle?: any;
		tagName?: string;
		children?: IHTMLContentElement[];
		isText?: boolean;
	}

	// --- Begin Monaco.Modes
	export namespace Modes {
		export interface ILanguage {
			// required
			name: string;								// unique name to identify the language
			tokenizer: Object;							// map from string to ILanguageRule[]

			// optional
			displayName?: string;						// nice display name
			ignoreCase?: boolean;							// is the language case insensitive?
			lineComment?: string;						// used to insert/delete line comments in the editor
			blockCommentStart?: string;					// used to insert/delete block comments in the editor
			blockCommentEnd?: string;
			defaultToken?: string;						// if no match in the tokenizer assign this token class (default 'source')
			brackets?: ILanguageBracket[];				// for example [['{','}','delimiter.curly']]

			// advanced
			start?: string;								// start symbol in the tokenizer (by default the first entry is used)
			tokenPostfix?: string;						// attach this to every token class (by default '.' + name)
			autoClosingPairs?: string[][];				// for example [['"','"']]
			wordDefinition?: RegExp;					// word definition regular expression
			outdentTriggers?: string;					// characters that could potentially cause outdentation
			enhancedBrackets?: Modes.IRegexBracketPair[];// Advanced auto completion, auto indenting, and bracket matching
		}

		/**
		 * This interface can be shortened as an array, ie. ['{','}','delimiter.curly']
		 */
		export interface ILanguageBracket {
			open: string;	// open bracket
			close: string;	// closeing bracket
			token: string;	// token class
		}

		export interface ILanguageAutoComplete {
			triggers: string;				// characters that trigger auto completion rules
			match: string|RegExp;			// autocomplete if this matches
			complete: string;				// complete with this string
		}

		export interface ILanguageAutoIndent {
			match: string|RegExp; 			// auto indent if this matches on enter
			matchAfter: string|RegExp;		// and auto-outdent if this matches on the next line
		}

		/**
		 * Standard brackets used for auto indentation
		 */
		export interface IBracketPair {
			tokenType:string;
			open:string;
			close:string;
			isElectric:boolean;
		}

		/**
		 * Regular expression based brackets. These are always electric.
		 */
		export interface IRegexBracketPair {
			openTrigger?: string; // The character that will trigger the evaluation of 'open'.
			open: RegExp; // The definition of when an opening brace is detected. This regex is matched against the entire line upto, and including the last typed character (the trigger character).
			closeComplete?: string; // How to complete a matching open brace. Matches from 'open' will be expanded, e.g. '</$1>'
			matchCase?: boolean; // If set to true, the case of the string captured in 'open' will be detected an applied also to 'closeComplete'.
								// This is useful for cases like BEGIN/END or begin/end where the opening and closing phrases are unrelated.
								// For identical phrases, use the $1 replacement syntax above directly in closeComplete, as it will
								// include the proper casing from the captured string in 'open'.
								// Upper/Lower/Camel cases are detected. Camel case dection uses only the first two characters and assumes
								// that 'closeComplete' contains wors separated by spaces (e.g. 'End Loop')

			closeTrigger?: string; // The character that will trigger the evaluation of 'close'.
			close?: RegExp; // The definition of when a closing brace is detected. This regex is matched against the entire line upto, and including the last typed character (the trigger character).
			tokenType?: string; // The type of the token. Matches from 'open' or 'close' will be expanded, e.g. 'keyword.$1'.
							   // Only used to auto-(un)indent a closing bracket.
		}

		/**
		 * Definition of documentation comments (e.g. Javadoc/JSdoc)
		 */
		export interface IDocComment {
			scope: string; // What tokens should be used to detect a doc comment (e.g. 'comment.documentation').
			open: string; // The string that starts a doc comment (e.g. '/**')
			lineStart: string; // The string that appears at the start of each line, except the first and last (e.g. ' * ').
			close?: string; // The string that appears on the last line and closes the doc comment (e.g. ' */').
		}

		// --- Begin InplaceReplaceSupport
		/**
		 * Interface used to navigate with a value-set.
		 */
		export interface IInplaceReplaceSupport {
			sets: string[][];
		}
		export var InplaceReplaceSupport: {
			register(modeId: string, inplaceReplaceSupport: Modes.IInplaceReplaceSupport): Disposable;
		};
		// --- End InplaceReplaceSupport


		// --- Begin TokenizationSupport
		enum Bracket {
			None = 0,
			Open = 1,
			Close = -1
		}

		export var hasTextMateTokenizerSupport: boolean;

		// --- Begin ICommentsSupport
		export interface ICommentsSupport {
			commentsConfiguration: ICommentsConfiguration;
		}
		export interface ICommentsConfiguration {
			lineCommentTokens?:string[];
			blockCommentStartToken?:string;
			blockCommentEndToken?:string;
		}
		export var CommentsSupport: {
			register(modeId:string, commentsSupport:ICommentsSupport): Disposable;
		};
		// --- End ICommentsSupport

		// --- Begin ITokenTypeClassificationSupport
		export interface ITokenTypeClassificationSupport {
			wordDefinition?: RegExp;
		}
		export var TokenTypeClassificationSupport: {
			register(modeId:string, tokenTypeClassificationSupport:ITokenTypeClassificationSupport): Disposable;
		};
		// --- End ITokenTypeClassificationSupport

		// --- Begin IElectricCharacterSupport
		export interface IElectricCharacterSupport {
			brackets: IBracketPair[];
			regexBrackets?: IRegexBracketPair[];
			docComment?: IDocComment;
			caseInsensitive?: boolean;
			embeddedElectricCharacters?: string[];
		}
		export var ElectricCharacterSupport: {
			register(modeId:string, electricCharacterSupport:IElectricCharacterSupport): Disposable;
		};
		// --- End IElectricCharacterSupport

		// --- Begin ICharacterPairSupport
		export interface ICharacterPairSupport {
			autoClosingPairs: IAutoClosingPairConditional[];
			surroundingPairs?: IAutoClosingPair[];
		}
		/**
		 * Interface used to support insertion of matching characters like brackets and qoutes.
		 */
		export interface IAutoClosingPair {
			open:string;
			close:string;
		}
		export interface IAutoClosingPairConditional extends IAutoClosingPair {
			notIn?: string[];
		}
		export var CharacterPairSupport: {
			register(modeId:string, characterPairSupport:ICharacterPairSupport): Disposable;
		};
		// --- End ICharacterPairSupport

		// --- Begin IOnEnterSupport
		export interface IBracketPair2 {
			open: string;
			close: string;
		}
		export interface IIndentationRules {
			decreaseIndentPattern: RegExp;
			increaseIndentPattern: RegExp;
			indentNextLinePattern?: RegExp;
			unIndentedLinePattern?: RegExp;
		}
		export enum IndentAction {
			None,
			Indent,
			IndentOutdent,
			Outdent
		}
		export interface IEnterAction {
			indentAction:IndentAction;
			appendText?:string;
			removeText?:number;
		}
		export interface IOnEnterRegExpRules {
			beforeText: RegExp;
			afterText?: RegExp;
			action: IEnterAction;
		}
		export interface IOnEnterSupportOptions {
			brackets?: IBracketPair2[];
			indentationRules?: IIndentationRules;
			regExpRules?: IOnEnterRegExpRules[];
		}
		export var OnEnterSupport: {
			register(modeId:string, opts:IOnEnterSupportOptions): Disposable;
		};
		// --- End IOnEnterSupport

		export interface IReference {
			resource: Uri;
			range: Range;
		}

		export interface IMode {
			getId(): string;
		}

		export interface IWorker<T> {
			disposable: Disposable;
			load(): Thenable<T>;
		}

		function registerMonarchDefinition(modeId: string, language: Modes.ILanguage): Disposable;
		function loadInBackgroundWorker<T>(scriptSrc: string): IWorker<T>;

	}


}

/**
 * Thenable is a common denominator between ES6 promises, Q, jquery.Deferred, WinJS.Promise,
 * and others. This API makes no assumption about what promise libary is being used which
 * enables reusing existing code without migrating to a specific promise implementation. Still,
 * we recommand the use of native promises which are available in VS Code.
 */
interface Thenable<R> {
    /**
    * Attaches callbacks for the resolution and/or rejection of the Promise.
    * @param onfulfilled The callback to execute when the Promise is resolved.
    * @param onrejected The callback to execute when the Promise is rejected.
    * @returns A Promise for the completion of which ever callback is executed.
    */
    then<TResult>(onfulfilled?: (value: R) => TResult | Thenable<TResult>, onrejected?: (reason: any) => TResult | Thenable<TResult>): Thenable<TResult>;
    then<TResult>(onfulfilled?: (value: R) => TResult | Thenable<TResult>, onrejected?: (reason: any) => void): Thenable<TResult>;
}

// ---- ES6 promise ------------------------------------------------------

/**
 * Represents the completion of an asynchronous operation
 */
interface Promise<T> extends Thenable<T> {
    /**
    * Attaches callbacks for the resolution and/or rejection of the Promise.
    * @param onfulfilled The callback to execute when the Promise is resolved.
    * @param onrejected The callback to execute when the Promise is rejected.
    * @returns A Promise for the completion of which ever callback is executed.
    */
    then<TResult>(onfulfilled?: (value: T) => TResult | Thenable<TResult>, onrejected?: (reason: any) => TResult | Thenable<TResult>): Promise<TResult>;
    then<TResult>(onfulfilled?: (value: T) => TResult | Thenable<TResult>, onrejected?: (reason: any) => void): Promise<TResult>;

    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected?: (reason: any) => T | Thenable<T>): Promise<T>;

    // [Symbol.toStringTag]: string;
}

interface PromiseConstructor {
    // /**
    //   * A reference to the prototype.
    //   */
    // prototype: Promise<any>;

    /**
     * Creates a new Promise.
     * @param executor A callback used to initialize the promise. This callback is passed two arguments:
     * a resolve callback used resolve the promise with a value or the result of another promise,
     * and a reject callback used to reject the promise with a provided reason or error.
     */
    new <T>(executor: (resolve: (value?: T | Thenable<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;

    /**
     * Creates a Promise that is resolved with an array of results when all of the provided Promises
     * resolve, or rejected when any Promise is rejected.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    all<T>(values: Array<T | Thenable<T>>): Promise<T[]>;

    /**
     * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
     * or rejected.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    race<T>(values: Array<T | Thenable<T>>): Promise<T>;

    /**
     * Creates a new rejected promise for the provided reason.
     * @param reason The reason the promise was rejected.
     * @returns A new rejected Promise.
     */
    reject(reason: any): Promise<void>;

    /**
     * Creates a new rejected promise for the provided reason.
     * @param reason The reason the promise was rejected.
     * @returns A new rejected Promise.
     */
    reject<T>(reason: any): Promise<T>;

    /**
      * Creates a new resolved promise for the provided value.
      * @param value A promise.
      * @returns A promise whose internal state matches the provided promise.
      */
    resolve<T>(value: T | Thenable<T>): Promise<T>;

    /**
     * Creates a new resolved promise .
     * @returns A resolved promise.
     */
    resolve(): Promise<void>;

    // [Symbol.species]: Function;
}

declare var Promise: PromiseConstructor;

// TS 1.6 & node_module
export = vscode;

// declare module 'vscode' {
//    export = vscode;
// }
