import { createClient } from '@/lib/supabase/server';

export default async function DynamicTheme() {
  try {
    const supabase = await createClient();
    const { data: themeData } = await supabase
      .from('site_content')
      .select('section_key, content_value')
      .eq('page_identifier', 'theme');

    if (!themeData || themeData.length === 0) return null;

    const theme: Record<string, string> = {};
    themeData.forEach(item => {
      theme[item.section_key] = item.content_value;
    });

    // Helper to generate CSS variables
    const generateCSS = () => {
      let css = '';
      if (theme.primary) {
        css += `--primary: ${theme.primary}; `;
        // Generate variants if missing? Or just use what's provided
      }
      if (theme.secondary) css += `--secondary: ${theme.secondary}; `;
      if (theme.foreground) css += `--foreground: ${theme.foreground}; `;
      if (theme.background) css += `--background: ${theme.background}; `;
      if (theme.primary_light) css += `--primary-light: ${theme.primary_light}; `;
      if (theme.primary_dark) css += `--primary-dark: ${theme.primary_dark}; `;
      if (theme.secondary_light) css += `--secondary-light: ${theme.secondary_light}; `;
      if (theme.secondary_dark) css += `--secondary-dark: ${theme.secondary_dark}; `;
      if (theme.navy) css += `--navy: ${theme.navy}; `;
      
      return css;
    };

    const cssContent = generateCSS();
    if (!cssContent) return null;

    return (
      <style id="dynamic-theme" dangerouslySetInnerHTML={{
        __html: `:root { ${cssContent} }`
      }} />
    );
  } catch (error) {
    console.error('Failed to load dynamic theme:', error);
    return null;
  }
}
