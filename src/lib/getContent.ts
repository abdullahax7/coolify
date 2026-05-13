import { createStaticClient } from '@/lib/supabase/server';

export type SiteContent = Record<string, string>;

export async function getPageContent(pageIdentifier: string, defaultContent: Record<string, string> = {}): Promise<SiteContent> {
  const supabase = await createStaticClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('section_key, content_value')
    .eq('page_identifier', pageIdentifier);

  if (error || !data) {
    console.error(`Failed to fetch content for page ${pageIdentifier}:`, error?.message);
    return defaultContent;
  }

  const content: SiteContent = { ...defaultContent };
  data.forEach((item) => {
    content[item.section_key] = item.content_value;
  });

  return content;
}

export async function getGlobalData<T>(sectionKey: string, defaultValue: T): Promise<T> {
  const supabase = await createStaticClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('content_value')
    .eq('page_identifier', 'global_data')
    .eq('section_key', sectionKey)
    .single();

  if (error || !data) {
    if (error && error.code !== 'PGRST116') { // PGRST116 is code for no rows returned
      console.error(`Failed to fetch global data ${sectionKey}:`, error.message);
    }
    return defaultValue;
  }

  try {
    return JSON.parse(data.content_value) as T;
  } catch (e) {
    console.error(`Failed to parse global data ${sectionKey}:`, e);
    return defaultValue;
  }
}
