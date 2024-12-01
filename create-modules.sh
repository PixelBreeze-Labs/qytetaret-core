#!/bin/bash

# Base modules directory
BASE_DIR="src/modules"

# Function to create module structure
create_module() {
    local module=$1
    local dir="$BASE_DIR/$module"
    
    # Create directories
    mkdir -p "$dir"
    mkdir -p "$dir/dtos"
    mkdir -p "$dir/entities"
    
    # Create files
    touch "$dir/$module.module.ts"
    touch "$dir/$module.controller.ts"
    touch "$dir/$module.service.ts"
    
    # Create DTOs and entities based on module
    case $module in
        "report")
            touch "$dir/dtos/create-report.dto.ts"
            touch "$dir/dtos/update-report.dto.ts"
            touch "$dir/entities/report.entity.ts"
            ;;
        "media")
            touch "$dir/dtos/upload-media.dto.ts"
            touch "$dir/entities/media.entity.ts"
            ;;
        "comment")
            touch "$dir/dtos/create-comment.dto.ts"
            touch "$dir/entities/comment.entity.ts"
            ;;
    esac
}

# Create modules
create_module "report"
create_module "media"
create_module "comment"

echo "Module structures created successfully!"
