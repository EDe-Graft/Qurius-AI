import React from 'react';
import { Text } from "react-native";

// Custom markdown parser for better scrolling performance
export default function parseMarkdown(text: string, colors: any) {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  
  // Bold: **text**
  const boldRegex = /\*\*(.*?)\*\*/g;
  let boldMatch;
  while ((boldMatch = boldRegex.exec(text)) !== null) {
    // Add text before the bold
    if (boldMatch.index > currentIndex) {
      parts.push(
        <Text key={`text-${currentIndex}`} style={{ color: colors.text, lineHeight: 24, fontSize: 16, fontFamily: 'Inter' }}>
          {text.slice(currentIndex, boldMatch.index)}
        </Text>
      );
    }
    
    // Add bold text
    parts.push(
      <Text key={`bold-${currentIndex}`} style={{ color: colors.text, lineHeight: 24, fontSize: 16, fontFamily: 'Inter', fontWeight: 'bold' }}>
        {boldMatch[1]}
      </Text>
    );
    
    currentIndex = boldMatch.index + boldMatch[0].length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(
      <Text key={`text-end`} style={{ color: colors.text, lineHeight: 24, fontSize: 16, fontFamily: 'Inter' }}>
        {text.slice(currentIndex)}
      </Text>
    );
  }
  
  return parts.length > 0 ? parts : (
    <Text style={{ color: colors.text, lineHeight: 24, fontSize: 16, fontFamily: 'Inter' }}>
      {text}
    </Text>
  );
}

// Enhanced markdown parser with multiple features
export const parseEnhancedMarkdown = (text: string, colors: any) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  lines.forEach((line, lineIndex) => {
    if (line.trim() === '') {
      elements.push(<Text key={`empty-${lineIndex}`}>{'\n'}</Text>);
      return;
    }
    
    // Check if it's a list item
    if (line.trim().startsWith('- ')) {
      const listItem = line.trim().substring(2);
      elements.push(
        <Text key={`list-${lineIndex}`} style={{ color: colors.text, lineHeight: 24, fontSize: 16, fontFamily: 'Inter' }}>
          <Text style={{ color: colors.primary, fontWeight: 'bold' }}>• </Text>
          {parseInlineMarkdown(listItem, colors)}
        </Text>
      );
      return;
    }
    
    // Regular text with inline markdown
    elements.push(
      <Text key={`line-${lineIndex}`} style={{ color: colors.text, lineHeight: 24, fontSize: 16, fontFamily: 'Inter' }}>
        {parseInlineMarkdown(line, colors)}
      </Text>
    );
  });
  
  return elements;
};

// Parse inline markdown (bold, italic, links)
export const parseInlineMarkdown = (text: string, colors: any) => {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  
  // Bold: **text**
  const boldRegex = /\*\*(.*?)\*\*/g;
  let boldMatch;
  while ((boldMatch = boldRegex.exec(text)) !== null) {
    // Add text before the bold
    if (boldMatch.index > currentIndex) {
      parts.push(text.slice(currentIndex, boldMatch.index));
    }
    
    // Add bold text
    parts.push(
      <Text key={`bold-${currentIndex}`} style={{ fontWeight: 'bold' }}>
        {boldMatch[1]}
      </Text>
    );
    
    currentIndex = boldMatch.index + boldMatch[0].length;
  }
  
  // Italic: *text*
  const italicRegex = /\*(.*?)\*/g;
  let italicMatch;
  while ((italicMatch = italicRegex.exec(text)) !== null) {
    // Add text before the italic
    if (italicMatch.index > currentIndex) {
      parts.push(text.slice(currentIndex, italicMatch.index));
    }
    
    // Add italic text
    parts.push(
      <Text key={`italic-${currentIndex}`} style={{ fontStyle: 'italic' }}>
        {italicMatch[1]}
      </Text>
    );
    
    currentIndex = italicMatch.index + italicMatch[0].length;
  }
  
  // Links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (linkMatch.index > currentIndex) {
      parts.push(text.slice(currentIndex, linkMatch.index));
    }
    
    // Add link text
    parts.push(
      <Text key={`link-${currentIndex}`} style={{ color: colors.primary, textDecorationLine: 'underline' }}>
        {linkMatch[1]}
      </Text>
    );
    
    currentIndex = linkMatch.index + linkMatch[0].length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }
  
  return parts.length > 0 ? parts : text;
};