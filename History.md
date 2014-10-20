
n.n.n / 2014-10-20
==================

 * Merge branch 'feature/add-symbol-node'
 * Add docs for SymbolNode
 * Add functionality for SymbolNode
 * Add tests for SymbolNode

0.2.1 / 2014-10-13
==================

 * Add support for data-properties in `valueOf()`
 * Update .gitignore, .npmignore, bower ignore
 * Move spec/textom.spec.js to test.js

0.2.0 / 2014-10-07
==================

 * Fix links to sections for GitHub
 * Fix few typos, links to sections for GitHub
 * Refactor in Readme.md
 * Add automatic `emit`ting of events to trigger

0.2.0-rc.5 / 2014-10-06
==================

 * Remove not dependended on dependency from spec

0.2.0-rc.4 / 2014-10-06
==================

 * Merge branch 'feature/event-cancelation'
 * Add new event mechanism
 * Add `nodeName` to IDL definition in Readme.md

0.2.0-rc.3 / 2014-10-06
==================

 * Add `valueOf` to IDL definition in Readme.md
 * Fix split prototype: Parent#split > Element#split

0.2.0-rc.2 / 2014-10-03
==================

 * Merge branch 'feature/add-value-of-support'
 * Add `Parent#valueOf()`, `Text#valueOf()`
 * Add spec for `valueOf()`

0.2.0-rc.1 / 2014-09-29
==================

 * Merge branch 'feature/add-node-names'
 * Add `nodeName` properties to nodes
 * Add spec for `nodeName` properties
 * Update API
 * Refactor spec
 * Fix indent in .jscs.json
 * Remove tags-only npm deployment from travis
 * Remove `npm update npm` from travis
 * Update .gitignore, .npmignore
 * Update Installation in docs
 * Reorder properties in package.json, component.json, bower.json
 * Update copyright in Readme.md
 * Remove browser test
 * Remove testling
 * Add broader jscs version range
 * Update eslint to 0.8.0
 * Fix two ungrammatical sentences
 * Fix link, now pointing to parse-latin instead of -english
 * Add a fancy word

0.1.1 / 2014-07-25
==================

 * Fixed typos in bower.json
 * Add bower.json

0.1.0 / 2014-07-24
==================

 * Update travis to auto-deploy to NPM
 * Add parse-dutch to list of related projects
 * Update assertion and unit test count
 * Add notes about the semantics of different nodes
 * Update mocha

0.1.0-rc.4 / 2014-07-17
==================

 * Refactored insert validation to its own function
 * Refactored listen, ignore, trigger, and emit to be constructed on each instantiation
 * Fixed duplicate code in Parent#split and Text#split
 * Removed two unused variables
 * Added comment about why codecoverage fails
 * Replaced unicode with ascii (en-dash to hyphen-minus)
 * Updated examples to match latest API changes

0.1.0-rc.3 / 2014-07-11
==================

 * Both rewrote and refactored documentation
 * Updated IDL to match latest API changes
 * Added parse-latin to Related
 * Node types are now strings (fixes #8)
 * Updated versions of eslint, istanbul

0.1.0-rc.2 / 2014-07-04
==================

 * Updated dependency versions of istanbul and jscs to 0.2.16 and 1.5.7 resp.
 * Added a better internal hierarchy mechanism
 * Appending or prepending a node into itself now throws (rather than looping till infinity)
 * WordNode, WhiteSpaceNode, and PunctuationNode now accept children (fixes #6)

0.1.0-rc.1 / 2014-07-03
==================

 * Added documentation for 8bdab19
 * Added initial unit tests for 8bdab19
 * API now exposes the event triggering mechanisms (fixes #7)
 * Added unit test for changes in fd13b95
 * WhiteSpace inherits from Punctuation (fixes #5)
 * Throwing hierarchy errors no longer happends based on whether or not the property exists, but on its value
 * Removed functionality to browserify unit tests by default
 * Filled changelog
 * Add History.md

0.0.20 / 2014-06-25
==================

 * 0.0.20
 * Bring browser.spec.js up to date with the changes in a67b20d
 * Fixed a typo in the `make` script
 * Modified documentation, due to changes in a67b20d
 * Modified unit tests, due to changes in a67b20d
 * the [removeinside] event now fires with the previous parent as an argument
 * Unit tests can now run in the browser (spec/index.html)
 * Fixed a bug where everything in ./spec/ was tested
 * Split the `lint` task into two different tasks (lint-api and lint-test)
 * Update dependency version of jscs to 1.5.3
 * Modified documentation, due to changes in e4c3957
 * Modified unit tests, due to changes in e4c3957
 * TextOM now exports a SourceNode (fixes #3)
 * Refactored `Node.isImplementedBy()` unit tests (fixes #2)
 * Modified documentation, due to changes in a63b814
 * Modified unit tests, due to changes in a63b814
 * TextOM is no longer a function, but just an object (fixes #4)
 * Update dependency version of jscs to 1.5.2

0.0.19 / 2014-06-16
==================

 * 0.0.19
 * Update dependency of JSCS to 1.5.1
 * Added unit tests for `Node#isImplementedBy()`

0.0.18 / 2014-06-15
==================

 * 0.0.18
 * Removed range from API, unit tests, and Readme; fixes #1
 * Removed the `Array#indexOf()` polyfill from unit tests

0.0.17 / 2014-06-10
==================

 * 0.0.17
 * Updated dependency version of 0.2.11
 * Fixed a missing dash in a link
 * Line break
 * Mentioned browser support in a seperate section (that darn Testling and its grey icons)
 * Made `assert.{throws,doesNotThrow}` expressions, strings; replaced calls to `Object.keys()` with loops
 * Added an `Array#indexOf()` polyfill to unit tests
 * TextOM now throws a detailed message when `Array#indexOf()` is not available--required for the library to function
 * Fixed a bug where the `toString` method was not added to prototypes in IE 6 through 8

0.0.16 / 2014-06-09
==================

 * 0.0.16
 * Added a testling badge
 * Added ci-testling fields to package.json
 * Removed Makefile, instead opting for just package.json
 * Added an “install with component” guide

0.0.15 / 2014-06-08
==================

 * 0.0.15
 * Added a coverage badge and upgraded badges to use svg
 * Added coveralls support through a new travis-ci Makefile target
 * Fixed a missing newline
 * Added an `after_script` (“coveralls”) hook for travis-ci
 * Istanbul outputs lcov coverage data again
 * travis-ci versions are now strings

0.0.14 / 2014-06-08
==================

 * 0.0.14
 * Added a paragraph about the new sanboxed environments added in 6bf992b5d845e77c393a7c529d3ff7ad6c55ff59
 * Fixed a grammar mistake
 * Mentioned parse-english and retext at the top of Readme
 * Inlined the `insertAfter` and `insertBeforeHead` functions into `append`, which is now named `insert`
 * Removed the `at` function in favour of the native `Array#indexOf`
 * Added API changes in 6bf992b5d845e77c393a7c529d3ff7ad6c55ff59 to Readme
 * Added unit tests for 6bf992b5d845e77c393a7c529d3ff7ad6c55ff59
 * Wrapped TextOM in a method, thus allowing the creation of multiple (sandboxed) TextOM instances
 * Inlined the `implementsConstructor` function into the `Node.isImplementedBy` method
 * Removed a call to `[].slice`, which now uses the globally cached `arraySlice`
 * Some comments were fixed to better describe the changes in 3a3b97f3150dff41e94998f3dbac940be4f8a24f
 * Updated component.js version to 0.0.13

0.0.13 / 2014-06-07
==================

 * 0.0.13
 * Removed git install “guide”
 * Updated test and assertion count
 * Made unit tests ESLint compliant, refactored a bit
 * Made index.js ESLint compliant
 * Added eslint targets, instead of jshint, to Makefile
 * Added ESLint, removed JSHint
 * Added component.json
 * Removed the IIFE, exdented the module
 * Now properties are exported through the `TextOM` namespace, rather than `exports`
 * Fixed some invalid code in examples
 * Added retext to Related projects

0.0.12 / 2014-06-06
==================

 * 0.0.12
 * Removed JSHint `expr:true`, cleaned code
 * Removed `boss:true`, cleaned code
 * Fixed some overly style issues introduced by 749237447d34e435f7afc33998c03d1df8d8f650
 * Fixed some grammar mistakes in spec-files
 * Added tests for c10534f0b9434ef58b71d420010fc0b8af3671d7
 * Removed `eqnull:true` from JSHint options and code, added better error throwing `Node#on` and `Node#off`
 * Spec now adheres to the jscs code style guide
 * `-` is now an allowed left-sticked operator (e.g., `-1`)
 * Added spec files to Makefile, to be tested by JSCodeStyleChecker
 * Fixed a wrongly stated JSDoc return type
 * Added IDL for 59c4ff1ca402a81ae24a19c092402495dee96036
 * Added docs for 59c4ff1ca402a81ae24a19c092402495dee96036
 * Added a missing backtick
 * Added tests for 59c4ff1ca402a81ae24a19c092402495dee96036
 * Added a Range#removeContent() method

0.0.11 / 2014-06-05
==================

 * 0.0.11
 * Updated dependency of mocha to its latest version
 * Added test for 00c114f4e9253b6e1eb03c8b7a09e28dc1bcbb2b
 * Added docs for 00c114f4e9253b6e1eb03c8b7a09e28dc1bcbb2b
 * The `remove` event now fires with the previous parent as an argument

0.0.10 / 2014-06-03
==================

 * 0.0.10
 * Fixed a styling issue where a line was 80 characters
 * Better events

0.0.9 / 2014-05-30
==================

 * 0.0.9
 * Added `Node#on` and `Node#off`—also added `[Constructor]` statements—to “WebIDL”
 * Fixed casing typo in Readme
 * Updated mocha dependency
 * Upped version to 0.0.8
 * Added API docs for `Node.on`, `Node.off`, `Node#on`, and `Node#off` to Readme
 * Fixed some spelling mistakes in index.js
 * Fixed some spelling mistakes in Readme
 * Changed double quotes in an example to single quotes
 * Removed possibility to listen to any event from api and spec
 * Upped version to 0.0.7
 * Upped test and assertion counts
 * Removed extraneous backtick on Readme
 * Modified some events, to work more in a similar manner, and updated tests
 * added documentation for events
 * Renamed a variable in a private function to better correspond with its value
 * - Added event listening mechanism to code (`Node#on`, `Node#off`, `Node.on`, and `Node.off`); - Moved some jshint comments to the top; - Added tests for the new introduced events (will docume * Removed the files array from package.json, instead opting for just .npmignore
 * Removed a tab character from an example
 * Patched version to 0.0.6
 * Added HTML reporter to Istanbul
 * Added leak checking to make watch
 * Added leak checking to mocha
 * Added jscs as a dev dependency, fixed code style
 * Improvements to Range: Added `getContent()`, algorithm improvements, more tests;
 * Added a line break
 * Every instance of Node now contains a `TextOM` attribute linking to the original TextOM
 * Mention ParseEnglish in README
 * Upped version to 0.0.5
 * "
 * Woops. Tried using a wrong Node version. This should work.
 * No longer supporting Node v0.8.26
 * Updated dependencies; fixed bug where istanbul broke.
 * Fixed bug where an error was only thrown when a ParentNode has children
 * Api changes; bug fixes.
 * Added hierarchy definitions to IDL
 * Added `TextOM.Parent#split` to IDL
 * Removed `Node#type` from IDL
 * Removed `TextOM.Node#type` from docs
 * Update test and assertion count
 * Updated Makefile to include more specific globs
 * Hierarchy errors are now only thrown when applicable
 * Bumped version (to 0.0.3)
 * Fixed whitespace/line-endings. Added hierarchy rules.
 * Update Makefile to include less ambiguous globs
 * Bumped version to 0.0.2
 * Utilites no longer reside in their own file, but are included in the library; The name of the project is now lowercase.
 * Removed `component`.
 * Better tasks in Makefile, and `npm test` in package.json.
 * Removed testling.
 * Initial commit
