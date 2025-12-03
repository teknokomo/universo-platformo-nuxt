#!/bin/bash
# =============================================================================
# Bilingual Documentation Validation Script
# =============================================================================
# Purpose: Validates that README.md and README-RU.md have matching line counts
# within the allowed tolerance (±2 lines)
#
# Usage: ./scripts/validate-i18n-docs.sh
#
# Exit codes:
#   0 - All validations passed
#   1 - One or more validations failed
#
# This script supports:
#   - Single file pair validation (README.md and README-RU.md)
#   - Multiple file pairs (finds all *-RU.md files)
#   - Detailed reporting with line counts and differences
# =============================================================================

set -e

# Configuration
TOLERANCE=2
VERBOSE=true

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL_PAIRS=0
PASSED=0
FAILED=0

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $message"
    elif [ "$status" = "FAIL" ]; then
        echo -e "${RED}❌ FAIL${NC}: $message"
    elif [ "$status" = "INFO" ]; then
        echo -e "${YELLOW}ℹ${NC}  $message"
    fi
}

# Function to count lines in a file
count_lines() {
    local file=$1
    if [ -f "$file" ]; then
        wc -l < "$file" | tr -d ' '
    else
        echo "0"
    fi
}

# Function to validate a file pair
validate_pair() {
    local base_file=$1
    local ru_file=$2
    
    TOTAL_PAIRS=$((TOTAL_PAIRS + 1))
    
    # Check if both files exist
    if [ ! -f "$base_file" ]; then
        print_status "FAIL" "$base_file does not exist"
        FAILED=$((FAILED + 1))
        return 1
    fi
    
    if [ ! -f "$ru_file" ]; then
        print_status "FAIL" "$ru_file does not exist"
        FAILED=$((FAILED + 1))
        return 1
    fi
    
    # Count lines
    local base_lines=$(count_lines "$base_file")
    local ru_lines=$(count_lines "$ru_file")
    local diff=$((base_lines - ru_lines))
    local abs_diff=${diff#-}  # Absolute value
    
    # Verbose output
    if [ "$VERBOSE" = true ]; then
        echo ""
        print_status "INFO" "Validating: $base_file vs $ru_file"
        echo "    Base file lines:    $base_lines"
        echo "    Russian file lines: $ru_lines"
        echo "    Difference:         $diff lines"
    fi
    
    # Check tolerance
    if [ "$abs_diff" -le "$TOLERANCE" ]; then
        print_status "PASS" "$base_file and $ru_file (diff: $diff)"
        PASSED=$((PASSED + 1))
        return 0
    else
        print_status "FAIL" "$base_file and $ru_file differ by $abs_diff lines (tolerance: ±$TOLERANCE)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# Function to find and validate all file pairs
validate_all_pairs() {
    echo "============================================="
    echo "Bilingual Documentation Validation"
    echo "Tolerance: ±$TOLERANCE lines"
    echo "============================================="
    
    # Validate main README files
    if [ -f "README.md" ] && [ -f "README-RU.md" ]; then
        validate_pair "README.md" "README-RU.md"
    fi
    
    # Find all *-RU.md files in packages
    if [ -d "packages" ]; then
        find packages -name "*-RU.md" 2>/dev/null | while read ru_file; do
            # Get the base file name by removing -RU suffix
            base_file="${ru_file%-RU.md}.md"
            if [ -f "$base_file" ]; then
                validate_pair "$base_file" "$ru_file"
            fi
        done
    fi
}

# Main execution
main() {
    validate_all_pairs
    
    echo ""
    echo "============================================="
    echo "Summary"
    echo "============================================="
    echo "Total pairs checked: $TOTAL_PAIRS"
    echo "Passed: $PASSED"
    echo "Failed: $FAILED"
    
    if [ "$FAILED" -gt 0 ]; then
        echo ""
        print_status "FAIL" "Some documentation files have mismatched line counts"
        echo "Please ensure translations have the same structure as the original."
        exit 1
    else
        echo ""
        print_status "PASS" "All bilingual documentation files are properly synchronized"
        exit 0
    fi
}

main "$@"
