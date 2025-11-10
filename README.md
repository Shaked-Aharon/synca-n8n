# n8n-nodes-synca

This is an n8n community node that enables [Synca N8N](https://n8n.synca.co.il) users to connect with third-party providers that don't have dedicated n8n nodes yet.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Synca N8N](https://n8n.synca.co.il) is a SaaS platform that provides unified access to various third-party APIs and services through a single interface, making it easy to integrate with providers that lack native n8n support.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

For users on n8n v0.187.0 or above:

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-synca` in **Enter npm package name**
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes
5. Select **Install**

After installation, the Synca node will be available in your n8n instance.

### Manual Installation

To install manually, navigate to your n8n installation directory and run:

```bash
npm install n8n-nodes-synca
```

## Prerequisites

Before using this node, you need:

1. A [Synca N8N](https://n8n.synca.co.il) account
2. API credentials from your Synca N8N dashboard

## Credentials

To connect the Synca node to your account:

1. Create a new credential in n8n
2. Select **Synca API** from the credentials list
3. Enter your Synca API Key (found in your Synca N8N dashboard)
4. Optionally configure the API endpoint if using a custom instance

## Operations

The Synca node provides access to various third-party providers through a unified interface. Available operations depend on the providers you've configured in your Synca N8N account.

### Common Operations

- **Make API Request**: Execute custom API requests to configured third-party providers
- **Get Data**: Retrieve data from integrated services
- **Send Data**: Send data to integrated services
- **List Resources**: List available resources from connected providers

## Usage

### Basic Example

1. Add the Synca node to your workflow
2. Select your Synca API credentials
3. Choose the third-party provider you want to connect with
4. Select the desired operation
5. Configure the operation parameters
6. Execute the workflow

### Example Workflow

```
Trigger → Synca Node → Process Data → Output
```

The Synca node acts as a bridge between n8n and third-party services, allowing you to:

- Access APIs without native n8n nodes
- Maintain centralized credential management through Synca
- Leverage pre-configured integrations
- Reduce development time for custom integrations

## Compatibility

- Minimum n8n version: 0.187.0
- Tested with n8n versions: 0.187.0+

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
<!-- - [Synca N8N Documentation](https://n8n.synca.co.il/docs) -->
<!-- - [Synca N8N Support](https://n8n.synca.co.il/support) -->

## Support

For issues related to:
- **The node itself**: Open an issue on [NPM](https://www.npmjs.com/package/n8n-nodes-synca)
<!-- - **Synca N8N platform**: Contact [Synca Support](https://n8n.synca.co.il/support) -->
- **n8n core functionality**: Visit [n8n's forum](https://community.n8n.io)

## Version History

### 1.0.0 (Current)
- Initial release
- Support for multiple third-party provider integrations
- Basic CRUD operations
- Credential management

## License

[MIT](LICENSE.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## About Synca N8N

Synca N8N is the next generation of the Synca platform, specifically designed to enhance n8n workflows by providing seamless access to third-party APIs and services. It simplifies the integration process by offering a unified interface for services that don't have dedicated n8n nodes.

---

**Note**: This is a community-maintained node. For the best experience, ensure you're using the latest version of both n8n and the Synca node.
