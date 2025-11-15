// Main Application Logic

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const inputCode = document.getElementById('inputCode');
    const outputCode = document.getElementById('outputCode');
    const languageSelect = document.getElementById('language');
    const levelSelect = document.getElementById('level');
    const obfuscateBtn = document.getElementById('obfuscateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const statsBar = document.getElementById('statsBar');
    const inputLineNumbers = document.getElementById('inputLineNumbers');
    const outputLineNumbers = document.getElementById('outputLineNumbers');
    const inputLines = document.getElementById('inputLines');
    const outputLines = document.getElementById('outputLines');

    // Checkboxes
    const compactCheck = document.getElementById('compact');
    const selfDefendingCheck = document.getElementById('selfDefending');
    const debugProtectionCheck = document.getElementById('debugProtection');
    const stringArrayCheck = document.getElementById('stringArray');
    const rotateStringArrayCheck = document.getElementById('rotateStringArray');

    // Sample code for each language
    const sampleCode = {
        javascript: `function greet(name) {
    const message = "Hello, " + name + "!";
    console.log(message);
    return message;
}

const user = "World";
const greeting = greet(user);

// Calculate something
function calculate(a, b) {
    return a + b * 2;
}

const result = calculate(5, 10);
console.log("Result:", result);`,
        python: `def greet(name):
    message = f"Hello, {name}!"
    print(message)
    return message

def calculate(a, b):
    return a + b * 2

user = "World"
greeting = greet(user)
result = calculate(5, 10)
print(f"Result: {result}")`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Page</title>
</head>
<body>
    <header>
        <h1>Welcome to My Website</h1>
        <nav>
            <a href="#home">Home</a>
            <a href="#about">About</a>
        </nav>
    </header>
    <main>
        <p>This is a sample page.</p>
    </main>
</body>
</html>`,
        css: `.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    background-color: #333;
    color: white;
    padding: 1rem;
}

.button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
}`
    };

    // Initialize
    loadSampleCode();
    updateLineNumbers(inputCode, inputLineNumbers, inputLines);

    // Load sample code
    function loadSampleCode() {
        const language = languageSelect.value;
        inputCode.value = sampleCode[language];
        updateLineNumbers(inputCode, inputLineNumbers, inputLines);
    }

    // Language change
    languageSelect.addEventListener('change', function() {
        if (!inputCode.value || confirm('Load sample code? This will replace your current code.')) {
            loadSampleCode();
        }
    });

    // Update line numbers
    function updateLineNumbers(textarea, lineNumberDiv, lineCountSpan) {
        const lines = textarea.value.split('\n').length;
        const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
        lineNumberDiv.textContent = lineNumbers;
        if (lineCountSpan) {
            lineCountSpan.textContent = `${lines} lines`;
        }
    }

    // Input code changes
    inputCode.addEventListener('input', function() {
        updateLineNumbers(inputCode, inputLineNumbers, inputLines);
    });

    inputCode.addEventListener('scroll', function() {
        inputLineNumbers.scrollTop = inputCode.scrollTop;
    });

    outputCode.addEventListener('scroll', function() {
        outputLineNumbers.scrollTop = outputCode.scrollTop;
    });

    // Obfuscate Button
    obfuscateBtn.addEventListener('click', function() {
        const code = inputCode.value.trim();
        
        if (!code) {
            showToast('Please enter some code to obfuscate!', 'error');
            return;
        }

        // Show loading state
        const originalHTML = obfuscateBtn.innerHTML;
        obfuscateBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i><span>Processing...</span>';
        obfuscateBtn.classList.add('loading');
        obfuscateBtn.disabled = true;

        // Simulate async operation
        setTimeout(() => {
            try {
                const language = languageSelect.value;
                const level = levelSelect.value;
                
                const options = {
                    level: level,
                    compact: compactCheck.checked,
                    selfDefending: selfDefendingCheck.checked,
                    debugProtection: debugProtectionCheck.checked,
                    stringArray: stringArrayCheck.checked,
                    rotateStringArray: rotateStringArrayCheck.checked
                };

                // Obfuscate based on language
                const obfuscated = Obfuscators[language](code, options);
                
                outputCode.value = obfuscated;
                updateLineNumbers(outputCode, outputLineNumbers, outputLines);

                // Show stats
                showStats(code, obfuscated);

                // Success notification
                showToast('Code obfuscated successfully!', 'success');

            } catch (error) {
                outputCode.value = '';
                showToast('Error: ' + error.message, 'error');
                console.error(error);
            } finally {
                obfuscateBtn.innerHTML = originalHTML;
                obfuscateBtn.classList.remove('loading');
                obfuscateBtn.disabled = false;
            }
        }, 500);
    });

    // Copy Button
    copyBtn.addEventListener('click', function() {
        if (!outputCode.value) {
            showToast('Nothing to copy!', 'error');
            return;
        }

        outputCode.select();
        document.execCommand('copy');
        showToast('Copied to clipboard!', 'success');
    });

    // Download Button
    downloadBtn.addEventListener('click', function() {
        if (!outputCode.value) {
            showToast('Nothing to download!', 'error');
            return;
        }

        const language = languageSelect.value;
        const extensions = {
            javascript: 'js',
            python: 'py',
            html: 'html',
            css: 'css'
        };

        const blob = new Blob([outputCode.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `obfuscated.${extensions[language]}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('File downloaded successfully!', 'success');
    });

    // Clear Button
    clearBtn.addEventListener('click', function() {
        if (confirm('Clear all code? This action cannot be undone.')) {
            inputCode.value = '';
            outputCode.value = '';
            statsBar.style.display = 'none';
            updateLineNumbers(inputCode, inputLineNumbers, inputLines);
            updateLineNumbers(outputCode, outputLineNumbers, outputLines);
            showToast('Code cleared', 'success');
        }
    });

    // Show Statistics
    function showStats(original, obfuscated) {
        const originalSize = new Blob([original]).size;
        const obfuscatedSize = new Blob([obfuscated]).size;
        const compression = ((1 - obfuscatedSize / originalSize) * 100).toFixed(2);

        document.getElementById('originalSize').textContent = originalSize.toLocaleString();
        document.getElementById('obfuscatedSize').textContent = obfuscatedSize.toLocaleString();
        document.getElementById('compression').textContent = compression;
        
        statsBar.style.display = 'flex';
    }

    // Show Toast Notification
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;

        container.appendChild(toast);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', function() {
            removeToast(toast);
        });

        // Auto remove after 4 seconds
        setTimeout(() => {
            removeToast(toast);
        }, 4000);
    }

    function removeToast(toast) {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to obfuscate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            obfuscateBtn.click();
        }
        
        // Ctrl/Cmd + S to download
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (outputCode.value) {
                downloadBtn.click();
            }
        }
    });
});