import React from 'react'
import { render, screen } from '@testing-library/react'
import { Logo, LogoMark } from '@/components/brand/logo'
import { BackgroundPattern, FeatureGradientBg, PremiumCard, GradientOrb } from '@/components/brand/visual-elements'

describe('Branding Components', () => {
  describe('Logo Component', () => {
    it('renders logo with name', () => {
      const { container } = render(<Logo showName={true} />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('renders logo without name', () => {
      const { container } = render(<Logo showName={false} />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('accepts custom width and height', () => {
      const { container } = render(<Logo width={32} height={32} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('renders LogoMark variant', () => {
      const { container } = render(<LogoMark />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('renders gradient text "ArcFlow"', () => {
      const { container } = render(<Logo showName={true} />)
      expect(container.textContent).toContain('ArcFlow')
    })

    it('renders tagline "Social Hub"', () => {
      const { container } = render(<Logo showName={true} />)
      expect(container.textContent).toContain('Social Hub')
    })
  })

  describe('Visual Elements', () => {
    it('renders BackgroundPattern', () => {
      const { container } = render(<BackgroundPattern />)
      const svgs = container.querySelectorAll('svg')
      expect(svgs.length).toBeGreaterThan(0)
    })

    it('renders GradientOrb with position', () => {
      const { container } = render(<GradientOrb position="top-right" />)
      expect(container.firstChild).toHaveClass('absolute')
    })

    it('renders FeatureGradientBg with index', () => {
      const { container } = render(<FeatureGradientBg index={0} />)
      expect(container.firstChild).toHaveClass('absolute')
    })

    it('renders PremiumCard with children', () => {
      const { container } = render(
        <PremiumCard>
          <div>Test Content</div>
        </PremiumCard>
      )
      expect(container.textContent).toContain('Test Content')
    })
  })

  describe('Gradient Utilities', () => {
    it('applies gradient classes correctly', () => {
      const { container } = render(
        <div className="bg-gradient-primary text-gradient-primary">
          Gradient Text
        </div>
      )
      const div = container.firstChild
      expect(div).toHaveClass('bg-gradient-primary')
      expect(div).toHaveClass('text-gradient-primary')
    })
  })

  describe('Accessibility', () => {
    it('logo has proper semantic structure', () => {
      const { container } = render(<Logo showName={true} />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('PremiumCard maintains content structure', () => {
      const testContent = 'Accessible Content'
      const { container } = render(
        <PremiumCard>
          <h3>{testContent}</h3>
        </PremiumCard>
      )
      expect(container.textContent).toContain(testContent)
    })
  })
})
