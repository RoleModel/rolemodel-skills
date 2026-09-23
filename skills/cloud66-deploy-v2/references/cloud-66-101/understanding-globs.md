# Understanding glob patterns


## What is a glob?

A glob (or "glob pattern") is a way to specify a set of text entities (like names or tags) based on a simple wildcard pattern - a bit like a very simple regular expression. For example, if you wished to match all the entities that had the word "new" anywhere in their text, you could use the glob `*new*`. Or if you wanted words only starting with "new", you could use the glob `new*`

## Glob syntax

Globs use wildcards to match strings of text. See below for the list and explanations of each. Globs are case sensitive. Spaces are considered characters.

|Wildcard|Description|Example|Matches|Does not match|
|--- |--- |--- |--- |--- |
|`*`|matches any number of any characters including none|`*New*`|`New`, `reNew`, or `Newly`|`Ne`, `newly` or `ew`|
|`?`|matches any single character|`?en`|`ten`, `men`, `len`|`en`|
|`[abc]`|matches one character from the bracket|`[MT]en`|`Men` or `Ten`|`pen`, `men` or `MTen`|
|`[a-z]`|matches one character from the range given in the bracket|`Count[0-9]`|`Count0`, `Count2` etc.|`Count`, `Count 1` or `Count10`|