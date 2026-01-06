import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Map common names to their Simple Icons slugs if they differ significantly
// Map common names to their Simple Icons slugs
const BRAND_SLUG_MAP = {
  // Streaming (Video)
  'youtube premium': 'youtube',
  'youtube music': 'youtubemusic',
  'amazon prime': 'amazon',
  'prime video': 'primevideo',
  'disney+': 'disneyplus',
  'disney plus': 'disneyplus',
  'hbo max': 'hbo',
  'max': 'hbo',
  'hulu': 'hulu',
  'peacock': 'peacock',
  'netflix': 'netflix',
  'apple tv': 'apple',
  'apple tv+': 'apple',
  'blutv': 'blu', // Might default to generic if not on SimpleIcons
  'exxen': 'playbutton', // exxen might not exist, use generic fallback later or map to something close if possible? No, let it error and fallback.
  'mubi': 'mubi',
  'crunchyroll': 'crunchyroll',
  'twitch': 'twitch',

  // Music
  'spotify': 'spotify',
  'apple music': 'apple',
  'deezer': 'deezer',
  'tidal': 'tidal',
  'soundcloud': 'soundcloud',
  'pandora': 'pandora',

  // Gaming
  'xbox': 'xbox',
  'xbox game pass': 'xbox',
  'game pass': 'xbox',
  'playstation': 'playstation',
  'ps plus': 'playstation',
  'playstation plus': 'playstation',
  'steam': 'steam',
  'epic games': 'epicgames',
  'nintendo': 'nintendo',
  'nintendo switch online': 'nintendo',
  'ea play': 'ea',
  'geforce now': 'nvidia',

  // Cloud & Software
  'google one': 'google',
  'google drive': 'googledrive',
  'icloud': 'apple',
  'icloud+': 'apple',
  'dropbox': 'dropbox',
  'onedrive': 'microsoftonedrive',
  'adobe': 'adobe',
  'adobe cc': 'adobecreativecloud',
  'creative cloud': 'adobecreativecloud',
  'photoshop': 'adobephotoshop',
  'office 365': 'microsoft365',
  'microsoft 365': 'microsoft365',
  'chatgpt': 'openai',
  'chat gpt': 'openai',
  'openai': 'openai',
  'claude': 'anthropic',
  'github': 'github',
  'gitlab': 'gitlab',
  'jetbrains': 'jetbrains',
  'canva': 'canva',
  'duolingo': 'duolingo',

  // Social / Other
  'x': 'x',
  'twitter': 'twitter',
  'linkedin': 'linkedin',
  'tinder': 'tinder',
  'bumble': 'bumble',
  'medium': 'medium',
  'discord': 'discord',
  'patreon': 'patreon',
  'amazon': 'amazon',
  'amazon prime': 'amazon',
  'amazonprime': 'amazon',
  'prime': 'amazon',
  'aws': 'amazonaws',
  'amazon web services': 'amazonaws',
  'google': 'google',
  'google workspace': 'google',
  'gmail': 'gmail',
  'drive': 'googledrive',
  'google drive': 'googledrive',
  'uber': 'uber',
  'uber one': 'uber',
  
  // Clean Aliases for Normalization Fallbacks
  'disney': 'disneyplus',
  'youtube': 'youtube',
  'googledrive': 'googledrive', // explicit mapping for safety
};

// Map categories to fallback icons
const getFallbackIcon = (category) => {
    switch (category) {
        case 'Bills': return 'receipt';
        case 'Movie Streaming': return 'movie';
        case 'Music': return 'music-note';
        case 'Gaming': return 'gamepad-variant';
        case 'Software': return 'code-braces';
        case 'Cloud': return 'cloud';
        case 'Reading': return 'book-open-page-variant';
        case 'Shopping': return 'cart';
        case 'Gym': return 'dumbbell';
        case 'Others': return 'shape-outline';
        default: return 'help-circle';
    }
};

export const BrandIcon = ({ name, category, size = 26, color = 'white' }) => {
    const [hasError, setHasError] = useState(false);
    
    // 1. Prepare inputs
    const lowerName = name.toLowerCase().trim();
    const normalizedName = lowerName.replace(/[^a-z0-9]/g, ''); 
    
    // 2. Lookup Logic used to determine the slug
    let slug = null;

    // A: Exact match in map (e.g. "amazon prime")
    if (BRAND_SLUG_MAP[lowerName]) {
        slug = BRAND_SLUG_MAP[lowerName];
    }
    // B: Normalized match in map (e.g. "chat gpt" -> "chatgpt" key in map)
    else if (BRAND_SLUG_MAP[normalizedName]) {
        slug = BRAND_SLUG_MAP[normalizedName];
    }
    // C: Fallback to normalized name itself (e.g. "netflix" -> "netflix")
    else {
        slug = normalizedName;
    }

    // Default white in hex (fffff) to match the dark theme, unless overridden
    const iconColor = color.replace('#', '');
    const uri = `https://cdn.simpleicons.org/${slug}/${iconColor}`;

    // Debugging: Uncomment to see what's failing in Metro logs
    // console.log(`BrandIcon: name="${name}" -> slug="${slug}" -> uri="${uri}" (Error: ${hasError})`);

    if (hasError) {
         return <MaterialCommunityIcons name={getFallbackIcon(category)} size={size} color={color} />;
    }

    return (
        <SvgUri
            width={size}
            height={size}
            uri={uri}
            onError={() => {
                // console.log(`BrandIcon Error for: ${name} (slug: ${slug})`);
                setHasError(true);
            }}
        />
    );
};
