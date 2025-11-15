// Obfuscation functions for different languages

const Obfuscators = {
    // JavaScript Obfuscation (FIXED)
    javascript: function(code, options) {
        try {
            // Base configuration
            const obfuscationOptions = {
                compact: options.compact,
                simplify: true,
                stringArray: options.stringArray,
                stringArrayRotate: options.rotateStringArray,
                stringArrayShuffle: true,
                renameGlobals: false,
                log: false,
                unicodeEscapeSequence: false
            };

            // Add options based on level
            if (options.level === 'medium' || options.level === 'high') {
                obfuscationOptions.controlFlowFlattening = true;
                obfuscationOptions.controlFlowFlatteningThreshold = 0.5;
                obfuscationOptions.deadCodeInjection = true;
                obfuscationOptions.deadCodeInjectionThreshold = 0.3;
                obfuscationOptions.stringArrayCallsTransform = true;
                obfuscationOptions.stringArrayThreshold = 0.75;
                obfuscationOptions.stringArrayWrappersCount = 1;
                obfuscationOptions.stringArrayWrappersChainedCalls = true;
                obfuscationOptions.stringArrayWrappersParametersMaxCount = 2;
                obfuscationOptions.stringArrayWrappersType = 'variable';
                obfuscationOptions.stringArrayIndexShift = true;
            }

            if (options.level === 'high') {
                obfuscationOptions.identifierNamesGenerator = 'hexadecimal';
                obfuscationOptions.numbersToExpressions = true;
                obfuscationOptions.splitStrings = true;
                obfuscationOptions.splitStringsChunkLength = 10;
                obfuscationOptions.stringArrayEncoding = ['base64'];
                obfuscationOptions.disableConsoleOutput = true;
                obfuscationOptions.controlFlowFlatteningThreshold = 0.75;
                obfuscationOptions.deadCodeInjectionThreshold = 0.4;
            } else {
                obfuscationOptions.identifierNamesGenerator = 'mangled';
            }

            // Self defending option
            if (options.selfDefending) {
                obfuscationOptions.selfDefending = true;
            }

            // Debug protection (FIXED: only add interval if protection is enabled)
            if (options.debugProtection) {
                obfuscationOptions.debugProtection = true;
                obfuscationOptions.debugProtectionInterval = 2000;
            }

            const obfuscationResult = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
            return obfuscationResult.getObfuscatedCode();
        } catch (error) {
            throw new Error('JavaScript obfuscation failed: ' + error.message);
        }
    },

    // Python Obfuscation (Basic)
    python: function(code, options) {
        let obfuscated = code;
        
        if (options.compact) {
            // Remove comments
            obfuscated = obfuscated.replace(/#.*$/gm, '');
            // Remove empty lines
            obfuscated = obfuscated.replace(/^\s*[\r\n]/gm, '');
        }

        if (options.level !== 'low') {
            // Simple variable name obfuscation
            const variables = obfuscated.match(/\b[a-z_][a-z0-9_]*\b/gi);
            if (variables) {
                const uniqueVars = [...new Set(variables)].filter(v => 
                    !['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 
                      'import', 'from', 'print', 'True', 'False', 'None', 'and', 'or', 
                      'not', 'in', 'is', 'lambda', 'with', 'as', 'pass', 'break', 
                      'continue', 'try', 'except', 'finally', 'raise'].includes(v)
                );
                
                uniqueVars.forEach((varName, index) => {
                    const newName = options.level === 'high' 
                        ? '_0x' + index.toString(16) 
                        : 'v' + index;
                    const regex = new RegExp('\\b' + varName + '\\b', 'g');
                    obfuscated = obfuscated.replace(regex, newName);
                });
            }
        }

        if (options.stringArray && options.level === 'high') {
            // Base64 encode strings
            obfuscated = obfuscated.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, (match) => {
                try {
                    const str = match.slice(1, -1);
                    if (str.length > 2) { // Only encode longer strings
                        const encoded = btoa(str);
                        return `__import__('base64').b64decode('${encoded}').decode()`;
                    }
                    return match;
                } catch {
                    return match;
                }
            });
        }

        return obfuscated;
    },

    // HTML Obfuscation
    html: function(code, options) {
        let obfuscated = code;

        if (options.compact) {
            // Remove comments
            obfuscated = obfuscated.replace(/<!--[\s\S]*?-->/g, '');
            // Remove extra whitespace
            obfuscated = obfuscated.replace(/\s+/g, ' ').trim();
        }

        if (options.level === 'high') {
            // Encode to HTML entities
            obfuscated = obfuscated.split('').map(char => {
                return '&#' + char.charCodeAt(0) + ';';
            }).join('');
        } else if (options.level === 'medium') {
            // Partial encoding
            obfuscated = obfuscated.replace(/[<>'"]/g, char => {
                return '&#' + char.charCodeAt(0) + ';';
            });
        }

        return obfuscated;
    },

    // CSS Obfuscation
    css: function(code, options) {
        let obfuscated = code;

        if (options.compact) {
            // Remove comments
            obfuscated = obfuscated.replace(/\/\*[\s\S]*?\*\//g, '');
            // Minify
            obfuscated = obfuscated
                .replace(/\s+/g, ' ')
                .replace(/\s*{\s*/g, '{')
                .replace(/\s*}\s*/g, '}')
                .replace(/\s*:\s*/g, ':')
                .replace(/\s*;\s*/g, ';')
                .replace(/\s*,\s*/g, ',')
                .trim();
        }

        if (options.level !== 'low') {
            // Obfuscate class names
            const classNames = obfuscated.match(/\.\w+/g);
            if (classNames) {
                const uniqueClasses = [...new Set(classNames)];
                uniqueClasses.forEach((className, index) => {
                    const newName = '.' + (options.level === 'high' 
                        ? '_0x' + index.toString(16)
                        : 'c' + index);
                    const regex = new RegExp('\\' + className + '\\b', 'g');
                    obfuscated = obfuscated.replace(regex, newName);
                });
            }

            // Obfuscate ID names
            const idNames = obfuscated.match(/#\w+/g);
            if (idNames) {
                const uniqueIds = [...new Set(idNames)];
                uniqueIds.forEach((idName, index) => {
                    const newName = '#' + (options.level === 'high' 
                        ? '_0x' + (index + 1000).toString(16)
                        : 'i' + index);
                    const regex = new RegExp('\\' + idName + '\\b', 'g');
                    obfuscated = obfuscated.replace(regex, newName);
                });
            }
        }

        return obfuscated;
    }
};