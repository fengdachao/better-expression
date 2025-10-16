# Better Sentence

AI-powered English sentence improvement tool using DeepSeek API. Transform your writing to be more natural, clear, and professional.

## ✨ Features

- **Multiple Writing Styles**: Choose from casual, formal, academic, or business styles
- **Real-time Improvements**: Get instant feedback with detailed explanations
- **Privacy-First**: Your API key stays in your browser, text is never stored
- **Cost-Effective**: Use your own DeepSeek API key for affordable improvements
- **Cross-Platform Ready**: Monorepo architecture for future Chrome extension and desktop apps

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- DeepSeek API key ([Get one here](https://platform.deepseek.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/better-sentence.git
   cd better-sentence
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

5. **Configure your API key**
   - Click the "Settings" button in the top right
   - Add your DeepSeek API key
   - Start improving your text!

## 🏗️ Project Structure

This is a monorepo built with modern tools for maximum code reuse:

```
better-sentence/
├── packages/
│   ├── core/           # 🔥 AI logic, platform-agnostic
│   └── ui/             # 🔥 React components, 90% reusable
├── apps/
│   └── web/            # Next.js web application
├── pnpm-workspace.yaml
└── turbo.json
```

### Architecture Highlights

- **@better-sentence/core**: Pure TypeScript logic for AI providers, text processing, and configuration
- **@better-sentence/ui**: React components and hooks that work across platforms
- **Monorepo**: 85-90% code reuse when expanding to Chrome extension and desktop apps

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev          # Start all packages in dev mode
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm type-check   # Type check all packages

# Web app specific
cd apps/web
pnpm dev          # Start web app only
pnpm build        # Build web app
```

### Adding New Features

1. **Core Logic**: Add to `packages/core/src/`
2. **UI Components**: Add to `packages/ui/src/components/`
3. **Web Features**: Add to `apps/web/`

## 🔧 Configuration

### DeepSeek API Setup

1. Visit [DeepSeek Platform](https://platform.deepseek.com/)
2. Sign up and get your API key
3. Add it in the app settings

### Environment Variables

Copy `env.example` to `.env.local` in `apps/web/`:

```bash
# Optional: Pre-configure API key (not recommended for production)
DEEPSEEK_API_KEY=sk-your-key-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set build settings**:
   - Build Command: `cd apps/web && npm run build`
   - Output Directory: `apps/web/.next`
   - Install Command: `pnpm install`

3. **Deploy** - Vercel will automatically deploy on push to main

### Manual Deployment

```bash
# Build the project
pnpm build

# Deploy the web app
cd apps/web
npm run start
```

## 🎯 Roadmap

### Phase 1: MVP ✅
- [x] Web application with DeepSeek integration
- [x] Multiple writing styles
- [x] Real-time improvements
- [x] Settings management

### Phase 2: Extensions (Coming Soon)
- [ ] Chrome extension for in-browser text improvement
- [ ] Electron desktop app
- [ ] Batch text processing

### Phase 3: Advanced Features
- [ ] History and favorites
- [ ] Custom style templates
- [ ] Team collaboration features
- [ ] API for third-party integrations

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following our coding standards
4. **Add tests** if applicable
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Use TypeScript for type safety
- Follow the existing code style
- Add JSDoc comments for public APIs
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [DeepSeek](https://deepseek.com/) for providing affordable and powerful AI models
- [Vercel](https://vercel.com/) for excellent deployment platform
- [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/better-sentence/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/better-sentence/discussions)
- **Email**: support@better-sentence.com

---

**Made with ❤️ using DeepSeek AI**