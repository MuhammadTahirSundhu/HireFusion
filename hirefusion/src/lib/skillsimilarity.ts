/**
 * Calculate similarity between two strings using Levenshtein distance
 * @returns A value between 0 and 1, where 1 means identical
 */
export function calculateSimilarity(str1: string, str2: string): number {
    // Convert to lowercase for case-insensitive comparison
    const s1 = str1.toLowerCase()
    const s2 = str2.toLowerCase()
  
    // Calculate Levenshtein distance
    const track = Array(s2.length + 1)
      .fill(null)
      .map(() => Array(s1.length + 1).fill(null))
  
    for (let i = 0; i <= s1.length; i += 1) {
      track[0][i] = i
    }
  
    for (let j = 0; j <= s2.length; j += 1) {
      track[j][0] = j
    }
  
    for (let j = 1; j <= s2.length; j += 1) {
      for (let i = 1; i <= s1.length; i += 1) {
        const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1
        track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator, // substitution
        )
      }
    }
  
    // Convert distance to similarity score (0-1)
    const maxLength = Math.max(s1.length, s2.length)
    if (maxLength === 0) return 1.0 // Both strings are empty
  
    const distance = track[s2.length][s1.length]
    return 1 - distance / maxLength
  }
  
  /**
   * Calculate Jaccard similarity between two arrays
   * @returns A value between 0 and 1, where 1 means identical sets
   */
  export function calculateJaccardSimilarity<T>(arr1: T[], arr2: T[]): number {
    if (arr1.length === 0 && arr2.length === 0) return 1.0
  
    const set1 = new Set(arr1)
    const set2 = new Set(arr2)
  
    // Calculate intersection size
    const intersection = new Set([...set1].filter((x) => set2.has(x)))
  
    // Calculate union size
    const union = new Set([...set1, ...set2])
  
    return intersection.size / union.size
  }
  
  /**
   * Calculate cosine similarity between two vectors
   * @returns A value between 0 and 1, where 1 means identical direction
   */
  export function calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      throw new Error("Vectors must have the same length")
    }
  
    let dotProduct = 0
    let norm1 = 0
    let norm2 = 0
  
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i]
      norm1 += vec1[i] * vec1[i]
      norm2 += vec2[i] * vec2[i]
    }
  
    // Handle zero vectors
    if (norm1 === 0 || norm2 === 0) return 0
  
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
  }
  