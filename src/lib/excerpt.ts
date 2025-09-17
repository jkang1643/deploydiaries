// Smart excerpt generation that skips table of contents and finds meaningful content
export const generateExcerpt = (markdown: string, maxLength: number = 150): string => {
  // FIRST: Remove table of contents BEFORE any other processing
  // This handles the markdown TOC format properly
  let content = markdown
  
  // Remove markdown TOC patterns - handle both "## Table of Contents" and "Table of Contents" headers
  const markdownTOCPatterns = [
    // Pattern 1: ## Table of Contents followed by numbered list with links, ending with ---
    /##\s+table\s+of\s+contents[\s\S]*?---[\s\S]*?(?=##\s+understanding|##\s+introduction|##\s+getting|##\s+prerequisites|##\s+step|##\s+let|##\s+we|##\s+this|##\s+before|##\s+the\s+first|$)/i,
    // Pattern 2: ## Table of Contents followed by numbered list with links (no ---)
    /##\s+table\s+of\s+contents[\s\S]*?(?=##\s+understanding|##\s+introduction|##\s+getting|##\s+prerequisites|##\s+step|##\s+let|##\s+we|##\s+this|##\s+before|##\s+the\s+first|$)/i,
    // Pattern 3: Just "Table of Contents" followed by numbered list with links
    /table\s+of\s+contents[\s\S]*?(?=##\s+understanding|##\s+introduction|##\s+getting|##\s+prerequisites|##\s+step|##\s+let|##\s+we|##\s+this|##\s+before|##\s+the\s+first|$)/i,
    // Pattern 4: Handle the case where TOC might not have a header
    /^\d+\.\s*\[.*?\]\(#.*?\)[\s\S]*?(?=##\s+understanding|##\s+introduction|##\s+getting|##\s+prerequisites|##\s+step|##\s+let|##\s+we|##\s+this|##\s+before|##\s+the\s+first|$)/i
  ]
  
  for (const pattern of markdownTOCPatterns) {
    content = content.replace(pattern, '').trim()
  }
  
  // Additional specific pattern for the exact format shown
  // This handles: ## Table of Contents ... [numbered list] ... --- ... ## Understanding
  const specificTOCPattern = /##\s+table\s+of\s+contents[\s\S]*?---\s*\n\s*##\s+understanding/i
  content = content.replace(specificTOCPattern, '## Understanding').trim()
  
  // Now strip all markdown formatting
  content = content
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove lists
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    // Remove extra whitespace and newlines
    .replace(/\n\s*\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Additional cleanup for any remaining TOC patterns
  const remainingTOCPatterns = [
    /table\s+of\s+contents.*?(?=\s+\d+\.\d+\.|introduction|in this|let's|we will|this guide|prerequisites|before we|step \d+|the first step|$)/i,
    /(\d+\.\d+\.\s*){2,}.*?(?=\s+\d+\.\d+\.|introduction|in this|let's|we will|this guide|prerequisites|before we|step \d+|the first step|our learning|microservices architecture|deployment strategy|five-service|$)/i,
    /^(\d+\.\d+\.\s*)+.*?(?=\s+\d+\.\d+\.|introduction|in this|let's|we will|this guide|prerequisites|before we|step \d+|the first step|our learning|microservices architecture|deployment strategy|five-service|$)/i,
    /(\d+\.\d+\.\s*){3,}.*?(?=\s+\d+\.\d+\.|introduction|in this|let's|we will|this guide|prerequisites|before we|step \d+|the first step|our learning|microservices architecture|deployment strategy|five-service|$)/i
  ]
  
  for (const pattern of remainingTOCPatterns) {
    content = content.replace(pattern, '').trim()
  }
  
  // Also remove any remaining TOC-like content that might have been missed
  const tocLikePatterns = [
    /understanding\s+microservices\s+architecture.*?(?=\s+\d+\.\d+\.|introduction|in this|let's|we will|this guide|prerequisites|before we|step \d+|the first step|$)/i,
    /what\s+is\s+microservices\s+architecture.*?(?=\s+\d+\.\d+\.|introduction|in this|let's|we will|this guide|prerequisites|before we|step \d+|the first step|$)/i,
    /amazon\s+eks\s+and\s+container\s+orchestration.*?(?=\s+\d+\.\d+\.|introduction|in this|let's|we will|this guide|prerequisites|before we|step \d+|the first step|$)/i,
    /why\s+choose\s+microservices.*?(?=\s+\d+\.\d+\.|introduction|in this|let's|we will|this guide|prerequisites|before we|step \d+|the first step|$)/i,
    /our learning application.*?(?=\s+\d+\.\d+\.|introduction|in this|let's|we will|this guide|prerequisites|before we|step \d+|the first step|$)/i,
    /microservices architecture overview.*?(?=\s+\d+\.\d+\.|introduction|in this|let's|we will|this guide|prerequisites|before we|step \d+|the first step|$)/i,
    /deployment strategy overview.*?(?=\s+\d+\.\d+\.|introduction|in this|let's|we will|this guide|prerequisites|before we|step \d+|the first step|$)/i,
    /five-service architecture.*?(?=\s+\d+\.\d+\.|introduction|in this|let's|we will|this guide|prerequisites|before we|step \d+|the first step|$)/i
  ]
  
  for (const pattern of tocLikePatterns) {
    content = content.replace(pattern, '').trim()
  }

  // Split content into paragraphs and find the first meaningful paragraph
  const paragraphs = content.split(/\s{2,}/).filter(p => p.trim().length > 0)
  
  let startIndex = 0
  
  // Skip paragraphs that look like table of contents
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].trim()
    const lowerParagraph = paragraph.toLowerCase()
    
    // Check if this paragraph matches TOC patterns
    const isTOC = lowerParagraph.startsWith('table of contents') ||
                  lowerParagraph.includes('introduction') && paragraph.length < 100 ||
                  lowerParagraph.includes('getting started') && paragraph.length < 100 ||
                  lowerParagraph.includes('prerequisites') && paragraph.length < 100 ||
                  lowerParagraph.includes('requirements') && paragraph.length < 100 ||
                  // Check for very short paragraphs that might be TOC items
                  (paragraph.length < 50 && (
                    paragraph.includes('1.') || 
                    paragraph.includes('2.') || 
                    paragraph.includes('3.') ||
                    paragraph.includes('•') ||
                    paragraph.includes('-')
                  )) ||
                  // Check for numbered sections that look like TOC
                  /^\d+\.\d*\.?\s+[A-Z]/.test(paragraph) ||
                  // Check for paragraphs that are mostly section titles
                  (paragraph.length < 200 && (
                    paragraph.includes('Understanding') && paragraph.includes('Architecture') ||
                    paragraph.includes('What is') && paragraph.includes('?') ||
                    paragraph.includes('Why Choose') ||
                    paragraph.includes('Amazon EKS') ||
                    paragraph.includes('Container Orchestration') ||
                    paragraph.includes('Microservices Architecture')
                  ))
    
    if (!isTOC) {
      startIndex = i
      break
    }
  }

  // Get the content starting from the first meaningful paragraph
  const meaningfulContent = paragraphs.slice(startIndex).join(' ')
  
  // If we have meaningful content, use it; otherwise fall back to original
  const finalContent = meaningfulContent.length > 50 ? meaningfulContent : content
  
  // Truncate to maxLength and add ellipsis if needed
  if (finalContent.length <= maxLength) {
    return finalContent
  }
  
  // Find the last complete word within the limit
  const truncated = finalContent.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  
  if (lastSpaceIndex > maxLength * 0.8) { // Only use word boundary if it's not too far back
    return truncated.substring(0, lastSpaceIndex) + '...'
  }
  
  return truncated + '...'
}

// Legacy function for backward compatibility
export const stripMarkdown = (markdown: string): string => {
  return generateExcerpt(markdown, 150)
}
