import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('law_cards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const cards = data.map(card => ({
      id: card.id,
      title: card.title || '',
      content: card.content || '',
      analysis: card.analysis || [],
      tags: card.tags || [],
      category: card.category || '',
      subcategory: card.subcategory || '待定',
      chapter: card.chapter || '',
      createdAt: card.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      readCount: card.read_count || 0,
      lastReadAt: card.last_read_at || null,
      masteryLevel: card.mastery_level || 0,
      isRead: card.is_read || false,
    }));

    return NextResponse.json(cards);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, content, analysis, tags, category, subcategory, chapter, masteryLevel } = body;

    const newCard = {
      id: id || Date.now().toString(),
      title: title || content?.substring(0, 30) + '...' || '',
      content: content || '',
      analysis: analysis || [],
      tags: tags || [],
      category: category || '',
      subcategory: subcategory || '待定',
      chapter: chapter || '',
      created_at: new Date().toISOString(),
      read_count: 0,
      last_read_at: null,
      mastery_level: masteryLevel || 0,
      is_read: false,
    };

    const { data, error } = await supabase
      .from('law_cards')
      .insert([newCard])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      title: data.title,
      content: data.content,
      analysis: data.analysis,
      tags: data.tags,
      category: data.category,
      subcategory: data.subcategory,
      chapter: data.chapter,
      createdAt: data.created_at?.split('T')[0],
      readCount: data.read_count,
      lastReadAt: data.last_read_at,
      masteryLevel: data.mastery_level,
      isRead: data.is_read,
    });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    const supabaseUpdates: any = {};
    if (updates.title !== undefined) supabaseUpdates.title = updates.title;
    if (updates.content !== undefined) supabaseUpdates.content = updates.content;
    if (updates.analysis !== undefined) supabaseUpdates.analysis = updates.analysis;
    if (updates.tags !== undefined) supabaseUpdates.tags = updates.tags;
    if (updates.category !== undefined) supabaseUpdates.category = updates.category;
    if (updates.subcategory !== undefined) supabaseUpdates.subcategory = updates.subcategory;
    if (updates.chapter !== undefined) supabaseUpdates.chapter = updates.chapter;
    if (updates.masteryLevel !== undefined) supabaseUpdates.mastery_level = updates.masteryLevel;
    if (updates.isRead !== undefined) supabaseUpdates.is_read = updates.isRead;
    if (updates.readCount !== undefined) supabaseUpdates.read_count = updates.readCount;
    if (updates.lastReadAt !== undefined) supabaseUpdates.last_read_at = updates.lastReadAt;

    const { data, error } = await supabase
      .from('law_cards')
      .update(supabaseUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      title: data.title,
      content: data.content,
      analysis: data.analysis,
      tags: data.tags,
      category: data.category,
      subcategory: data.subcategory,
      chapter: data.chapter,
      createdAt: data.created_at?.split('T')[0],
      readCount: data.read_count,
      lastReadAt: data.last_read_at,
      masteryLevel: data.mastery_level,
      isRead: data.is_read,
    });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('law_cards')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}
