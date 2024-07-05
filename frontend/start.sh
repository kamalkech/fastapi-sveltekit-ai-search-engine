#!/bin/sh

# Load environment variables
export $(grep -v '^#' .env.production | xargs)

# Start the application
node build

