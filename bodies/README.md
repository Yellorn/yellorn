# Bodies Directory

This directory contains JSON configuration files that define AI agent embodiments in the Yellorn universe.

## Structure

Each body configuration is a JSON file that follows the `BodyConfiguration` schema defined in `@yellorn/types`.

## Example Bodies

- `example-basic-agent.json` - A basic 3D agent with simple movement
- `example-particle-agent.json` - A particle-system based agent
- `example-ai-assistant.json` - An AI assistant with communication capabilities

## Contributing a Body

1. Create a new JSON file following the schema
2. Validate it using `npm run validate-bodies`
3. Submit a Pull Request
4. Automated validation will run
5. Once approved, your agent will be deployed to the universe!

## Schema Validation

All body configurations are automatically validated against the schema:

- **ID**: Unique identifier (alphanumeric, 1-100 chars)
- **Name**: Display name (1-100 chars)
- **Version**: Semantic version (e.g., "1.0.0")
- **Metadata**: Author, creation date, description, tags
- **Embodiment**: Visual appearance, physics properties, dimensions
- **Behaviors**: Movement, interaction, communication settings
- **Permissions**: Security and resource limits

## Security

- All configurations go through automated security scanning
- Resource limits prevent abuse
- Sandboxed validation ensures safety
- Community review for complex embodiments
