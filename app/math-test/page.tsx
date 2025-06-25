import BlogContent from '@/app/components/BlogContent'

export default function MathTestPage() {
  const mathContent = `# Math Rendering Test

This is a test of mathematical expressions in markdown.

## Inline Math

Here's some inline math: $\\mathcal{L}(\\theta)$ represents the loss function, and $\\lambda$ is the regularization parameter.

The individual loss is denoted as $\\ell$ and the regularization term as $\\Omega(\\theta)$.

## Display Math

Here's the complete loss function:

$$\\mathcal{L}(\\theta) = \\frac{1}{n} \\sum_{i=1}^{n} \\ell(f_\\theta(x_i), y_i) + \\lambda \\Omega(\\theta)$$

Where:

- $\\mathcal{L}(\\theta)$ is the loss function
- $\\ell$ is the individual loss  
- $\\Omega(\\theta)$ is the regularization term
- $\\lambda$ is the regularization parameter

## More Complex Examples

### Gradient Descent Update Rule

$$\\theta_{t+1} = \\theta_t - \\alpha \\nabla_{\\theta} \\mathcal{L}(\\theta_t)$$

### Softmax Function

$$\\text{softmax}(x_i) = \\frac{e^{x_i}}{\\sum_{j=1}^{K} e^{x_j}}$$

### Gaussian Distribution

$$f(x | \\mu, \\sigma^2) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$$

### Matrix Operations

$$\\mathbf{X}^T\\mathbf{X} = \\begin{pmatrix}
x_{11} & x_{21} & \\cdots & x_{n1} \\\\
x_{12} & x_{22} & \\cdots & x_{n2} \\\\
\\vdots & \\vdots & \\ddots & \\vdots \\\\
x_{1p} & x_{2p} & \\cdots & x_{np}
\\end{pmatrix}
\\begin{pmatrix}
x_{11} & x_{12} & \\cdots & x_{1p} \\\\
x_{21} & x_{22} & \\cdots & x_{2p} \\\\
\\vdots & \\vdots & \\ddots & \\vdots \\\\
x_{n1} & x_{n2} & \\cdots & x_{np}
\\end{pmatrix}$$

## Inline and Display Together

When training neural networks, we often minimize the loss $\\mathcal{L}(\\theta)$ using gradient descent. The full objective function can be written as:

$$\\min_{\\theta} \\mathcal{L}(\\theta) = \\min_{\\theta} \\left[ \\frac{1}{n} \\sum_{i=1}^{n} \\ell(f_\\theta(x_i), y_i) + \\lambda \\Omega(\\theta) \\right]$$

This combines both the empirical risk (first term) and a regularization penalty (second term).
`

  return (
    <div className="max-w-4xl mx-auto p-8">
      <BlogContent content={mathContent} />
    </div>
  )
}
