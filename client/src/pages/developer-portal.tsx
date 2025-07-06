import React from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  Code, 
  FileJson, 
  BookOpen,
  Braces,
  ServerCog,
  Lightbulb,
  Rocket,
  Blocks,
  Users,
  Wrench,
  Puzzle,
} from "lucide-react";

const DeveloperPortal = () => {
  return (
    <DocumentationLayout title="Developer Portal" subtitle="Comprehensive resources for building with Chronos Vault">
      <div className="container mx-auto p-4 space-y-8">
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-between">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                Build the Future of Digital Vaults
              </h1>
              <p className="text-lg text-gray-200">
                Integrate powerful multi-chain vault technology into your applications with the Chronos Vault
                developer toolkit. Our comprehensive APIs, SDKs, and smart contracts enable you to create
                secure, time-locked digital storage solutions across multiple blockchains.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700">
                  <Link href="/api-documentation">Explore the API</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/sdk-documentation">Get Started with SDKs</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex w-80 h-80 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-full items-center justify-center">
              <div className="w-72 h-72 bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/30 rounded-full flex items-center justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/40 rounded-full flex items-center justify-center">
                  <Code className="w-32 h-32 text-[#FF5AF7]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-8 bg-gray-800" />

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Essential Developer Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-black/20 border border-gray-800 hover:border-[#FF5AF7]/50 transition-all group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ServerCog className="h-6 w-6 text-green-500 group-hover:text-[#FF5AF7] transition-colors" />
                  API Keys Management
                </CardTitle>
                <CardDescription>
                  Generate and manage wallet integration credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Create API keys for external wallet developers to integrate with Chronos Vault Trinity Protocol security infrastructure.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full bg-green-600/10 border-green-600/30 hover:bg-green-600/20">
                  <Link href="/developer-api-keys">Manage API Keys</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-black/20 border border-gray-800 hover:border-[#FF5AF7]/50 transition-all group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-6 w-6 text-indigo-500 group-hover:text-[#FF5AF7] transition-colors" />
                  API Reference
                </CardTitle>
                <CardDescription>
                  Comprehensive API documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Detailed reference documentation for all Chronos Vault API endpoints, parameters, responses, and error codes.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/api-documentation">View API Reference</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-black/20 border border-gray-800 hover:border-[#FF5AF7]/50 transition-all group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Braces className="h-6 w-6 text-indigo-500 group-hover:text-[#FF5AF7] transition-colors" />
                  SDK Documentation
                </CardTitle>
                <CardDescription>
                  Client libraries for multiple languages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Official client SDKs for JavaScript, Python, Java, Go, and Rust, with code examples and usage guides.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/sdk-documentation">View SDK Documentation</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-black/20 border border-gray-800 hover:border-[#FF5AF7]/50 transition-all group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Puzzle className="h-6 w-6 text-indigo-500 group-hover:text-[#FF5AF7] transition-colors" />
                  Integration Guide
                </CardTitle>
                <CardDescription>
                  Step-by-step integration tutorials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Comprehensive guides and tutorials for integrating Chronos Vault into your applications and services.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/integration-guide">View Integration Guide</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-black/20 border border-gray-800 hover:border-[#FF5AF7]/50 transition-all group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Blocks className="h-6 w-6 text-indigo-500 group-hover:text-[#FF5AF7] transition-colors" />
                  Smart Contract SDK
                </CardTitle>
                <CardDescription>
                  Blockchain smart contract interfaces
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Smart contract interfaces, ABIs, and examples for Ethereum, TON, and Solana blockchain integrations.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/smart-contract-sdk">View Smart Contract SDK</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-black/20 border border-gray-800 hover:border-[#FF5AF7]/50 transition-all group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-indigo-500 group-hover:text-[#FF5AF7] transition-colors" />
                  Technical Specifications
                </CardTitle>
                <CardDescription>
                  Detailed technical documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  In-depth technical documentation covering architecture, security, protocols, and cryptographic implementations.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/technical-specification">View Technical Specifications</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-black/20 border border-gray-800 hover:border-[#FF5AF7]/50 transition-all group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-indigo-500 group-hover:text-[#FF5AF7] transition-colors" />
                  Integration Examples
                </CardTitle>
                <CardDescription>
                  Real-world integration use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Example projects and use cases demonstrating Chronos Vault integrations in various applications.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/integration-examples">View Integration Examples</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <Separator className="my-8 bg-gray-800" />

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Developer Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-indigo-500/20">
                  <ServerCog className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold">Triple-Chain Security</h3>
              </div>
              <p className="text-gray-400">
                Leverage our groundbreaking multi-blockchain verification system to offer unparalleled security guarantees.
              </p>
            </div>
            
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-indigo-500/20">
                  <Rocket className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold">Rapid Integration</h3>
              </div>
              <p className="text-gray-400">
                Get up and running quickly with well-documented SDKs and APIs designed for developer productivity.
              </p>
            </div>
            
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-indigo-500/20">
                  <Users className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold">Developer Community</h3>
              </div>
              <p className="text-gray-400">
                Join a thriving community of blockchain developers building the future of digital assets.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6 mt-12">
          <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 p-8 rounded-lg border border-[#FF5AF7]/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Ready to start building?</h2>
                <p className="text-gray-300">
                  Get early access to our developer program and receive personalized support from our team.
                </p>
              </div>
              <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700">
                <Link href="/contact">Contact Developer Relations</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </DocumentationLayout>
  );
};

export default DeveloperPortal;