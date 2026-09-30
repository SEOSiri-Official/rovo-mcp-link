import React from 'react';
import ForgeReconciler, { Text, Heading, Link, Stack, Box, Strong, Badge, Em } from '@forge/react';

const ConfluenceMacro = () => {
  return (
    <Box padding="space.300">
      <Stack space="space.200">
        <Heading as="h2">🌐 SEOSiri Live MCP Architecture Embed</Heading>
        <Text>This documentation page is dynamically linked to the SEOSiri Enterprise Control Plane.</Text>
        
        <Box padding="space.200" backgroundColor="color.background.neutral.subtle" borderRadius="border.radius.image">
          <Stack space="space.100">
            <Text><Strong>Active Edge Gateways:</Strong> 13 Official Cloudflare Nodes (*.seosiri.com)</Text>
            <Text><Strong>Published Packages:</Strong> 16 PyPI &amp; NPM Open-Source Suites</Text>
            <Text><Strong>Autonomous Tools:</Strong> 163 Enterprise Verification Tools</Text>
            <Text><Strong>Gateway Status:</Strong> <Badge text="HEALTHY (200 OK)" appearance="success" /></Text>
          </Stack>
        </Box>

        <Stack space="space.100">
          <Link href="https://developers.seosiri.com" openInNewTab>Explore Interactive D3 Topology Graph</Link>
          <Link href="https://www.seosiri.com/2026/07/seosiri-mcp-servers.html" openInNewTab>Read Master Technical Documentation Hub</Link>
        </Stack>

        <Text><Em>Embedded via SEOSiri Enterprise Labs • Certified Atlassian Marketplace Integration.</Em></Text>
      </Stack>
    </Box>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <ConfluenceMacro />
  </React.StrictMode>
);
