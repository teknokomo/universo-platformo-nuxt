# =============================================================================
# Bilingual Documentation Validation Script (PowerShell)
# =============================================================================
# Purpose: Validates that README.md and README-RU.md have matching line counts
# within the allowed tolerance (+/-2 lines)
#
# Usage: .\scripts\validate-i18n-docs.ps1
#
# Exit codes:
#   0 - All validations passed
#   1 - One or more validations failed
# =============================================================================

param(
    [int]$Tolerance = 2,
    [switch]$VerboseOutput
)

# Counters
$script:TotalPairs = 0
$script:Passed = 0
$script:Failed = 0

function Write-Status {
    param(
        [string]$Status,
        [string]$Message
    )
    
    switch ($Status) {
        "PASS" { Write-Host "[PASS] $Message" -ForegroundColor Green }
        "FAIL" { Write-Host "[FAIL] $Message" -ForegroundColor Red }
        "INFO" { Write-Host "[INFO] $Message" -ForegroundColor Yellow }
    }
}

function Get-LineCount {
    param([string]$FilePath)
    
    if (Test-Path $FilePath) {
        return (Get-Content $FilePath | Measure-Object -Line).Lines
    }
    return 0
}

function Test-FilePair {
    param(
        [string]$BaseFile,
        [string]$RuFile
    )
    
    $script:TotalPairs++
    
    # Check if both files exist
    if (-not (Test-Path $BaseFile)) {
        Write-Status "FAIL" "$BaseFile does not exist"
        $script:Failed++
        return $false
    }
    
    if (-not (Test-Path $RuFile)) {
        Write-Status "FAIL" "$RuFile does not exist"
        $script:Failed++
        return $false
    }
    
    # Count lines
    $baseLines = Get-LineCount $BaseFile
    $ruLines = Get-LineCount $RuFile
    $diff = $baseLines - $ruLines
    $absDiff = [Math]::Abs($diff)
    
    # Verbose output
    if ($VerboseOutput) {
        Write-Host ""
        Write-Status "INFO" "Validating: $BaseFile vs $RuFile"
        Write-Host "    Base file lines:    $baseLines"
        Write-Host "    Russian file lines: $ruLines"
        Write-Host "    Difference:         $diff lines"
    }
    
    # Check tolerance
    if ($absDiff -le $Tolerance) {
        Write-Status "PASS" "$BaseFile and $RuFile (diff: $diff)"
        $script:Passed++
        return $true
    } else {
        Write-Status "FAIL" "$BaseFile and $RuFile differ by $absDiff lines (tolerance: +/-$Tolerance)"
        $script:Failed++
        return $false
    }
}

function Test-AllPairs {
    Write-Host "============================================="
    Write-Host "Bilingual Documentation Validation"
    Write-Host "Tolerance: +/-$Tolerance lines"
    Write-Host "============================================="
    
    # Validate main README files
    if ((Test-Path "README.md") -and (Test-Path "README-RU.md")) {
        Test-FilePair "README.md" "README-RU.md" | Out-Null
    }
    
    # Find all *-RU.md files in packages
    if (Test-Path "packages") {
        Get-ChildItem -Path "packages" -Filter "*-RU.md" -Recurse | ForEach-Object {
            $ruFile = $_.FullName
            $baseFile = $ruFile -replace "-RU\.md$", ".md"
            if (Test-Path $baseFile) {
                Test-FilePair $baseFile $ruFile | Out-Null
            }
        }
    }
}

# Main execution
Write-Host ""
Test-AllPairs

Write-Host ""
Write-Host "============================================="
Write-Host "Summary"
Write-Host "============================================="
Write-Host "Total pairs checked: $script:TotalPairs"
Write-Host "Passed: $script:Passed"
Write-Host "Failed: $script:Failed"

if ($script:Failed -gt 0) {
    Write-Host ""
    Write-Status "FAIL" "Some documentation files have mismatched line counts"
    Write-Host "Please ensure translations have the same structure as the original."
    exit 1
} else {
    Write-Host ""
    Write-Status "PASS" "All bilingual documentation files are properly synchronized"
    exit 0
}
