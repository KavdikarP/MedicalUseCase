def split_text_with_overlap(text, chunk_size=2000, overlap=500):

    chunks = []
    start = 0
    end = chunk_size

    while end <= len(text):
        chunks.append(text[start:end])
        start += chunk_size - overlap
        end += chunk_size - overlap

    # Handle the last chunk if it doesn't reach the full chunk_size
    if start < len(text):
        chunks.append(text[start:])

    return chunks