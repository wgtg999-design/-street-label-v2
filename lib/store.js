import { env } from "../runtime/environment";
import { defaults, contentSchema, withBundledModelPhotos } from './content';
export async function readStore() { const row = await env.DB.prepare('SELECT data,revision,updated_at FROM store_content WHERE key = ?').bind('main').first(); return row ? { content: withBundledModelPhotos(contentSchema.parse(JSON.parse(row.data))), revision: row.revision, updatedAt: row.updated_at } : { content: withBundledModelPhotos(defaults), revision: 0, updatedAt: null }; }
