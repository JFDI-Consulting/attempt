#!/usr/bin/env bash
set -euo pipefail

usage() {
    echo "Usage: $0 <patch|minor|major|x.y.z>"
    echo ""
    echo "Bumps the version, commits, tags, pushes to GitHub, and creates a GitHub release."
    echo "The publish workflow then builds and publishes to npm automatically."
    exit 1
}

[[ $# -ne 1 ]] && usage

VERSION_ARG="$1"

# Validate argument
if [[ ! "$VERSION_ARG" =~ ^(patch|minor|major|[0-9]+\.[0-9]+\.[0-9]+)$ ]]; then
    echo "Error: argument must be patch, minor, major, or a semver like 1.4.1"
    exit 1
fi

# Ensure we're on master
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "master" && "$BRANCH" != "main" ]]; then
    echo "Error: must be on master or main branch (currently on $BRANCH)"
    exit 1
fi

# Ensure working tree is clean
if [[ -n "$(git status --porcelain)" ]]; then
    echo "Error: working tree is not clean. Commit or stash changes first."
    exit 1
fi

# Ensure we're up to date with remote
git fetch origin
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")
if [[ "$LOCAL" != "$REMOTE" ]]; then
    echo "Error: local branch is not up to date with origin/$BRANCH. Pull first."
    exit 1
fi

# Run tests before releasing
echo "Running tests..."
npm test

# Bump version — this updates package.json, npm-shrinkwrap.json, commits, and tags
echo "Bumping version ($VERSION_ARG)..."
npm version "$VERSION_ARG" -m "release: v%s"

NEW_VERSION=$(node -p "require('./package.json').version")
TAG="v$NEW_VERSION"

# Push commit and tag
echo "Pushing to origin..."
git push origin "$BRANCH" --follow-tags

# Create GitHub release (triggers the publish workflow)
echo "Creating GitHub release $TAG..."
gh release create "$TAG" \
    --title "$TAG" \
    --generate-notes

echo ""
echo "Done! Release $TAG created."
echo "The publish workflow will now build and publish to npm."
echo "Monitor at: https://github.com/JFDI-Consulting/attempt/actions"
