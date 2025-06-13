from io import BytesIO
from fastapi import UploadFile
import pdfplumber
from pdf2image import convert_from_bytes
import os
import pytesseract
from PIL import Image
from loguru import logger


async def convert_pdf_to_bytes(pdf: UploadFile):
    pdf_bytes = await pdf.read()
    pdf_buffer = BytesIO(pdf_bytes)
    return pdf_buffer

async def extract_text_outside_tables(pdf_buffer: BytesIO):
    """Extracts text from a PDF document, excluding text likely within tables.

    Args:
        pdf_path (str): The path to the PDF file.

    Returns:
        str: The extracted text.
    """
    logger.info("Extracting text outside tables")
    with pdfplumber.open(pdf_buffer) as pdf:
        text_segments = []
        for page in pdf.pages:
            segments = _extract_page_text_outside_tables(page)
            print ("Segments : ",segments)
            text_segments.extend(segments)

    return "\n".join(text_segments)


def _extract_page_text_outside_tables(page):
    """Extracts text from a single page, excluding text likely within tables."""

    page_text = page.extract_text()
    tables = page.find_tables()

    text_segments = []
    if tables:
        non_table_chars = _filter_chars_outside_tables(page.chars, tables)
        text_segments = _join_characters(non_table_chars)
    else:
        text_segments.append(page_text)  # No tables, include all text

    return text_segments


def _filter_chars_outside_tables(chars, tables):
    """Filters text characters unlikely to be within tables."""

    return [char for char in chars if not _is_char_within_table(char, tables)]


def _is_char_within_table(char, tables):
    """Checks if a character is likely within a table boundary."""

    for table in tables:
        table_bbox = table.bbox
        if (
            char["x0"] >= table_bbox[0]
            and char["x1"] <= table_bbox[2]
            and char["top"] >= table_bbox[1]
            and char["bottom"] <= table_bbox[3]
        ):
            return True
    return False


def _join_characters(chars):
    """Joins characters into text segments, preserving line breaks."""
    segments = []
    current_segment = ""
    for char in chars:

        if char["text"] == "\n":
            segments.append(current_segment)
            current_segment = ""
        else:
            current_segment += char["text"]
            #print ("Char ",char["text"])
    if current_segment:
        segments.append(current_segment)

    return segments

def dump_text_to_file(text, filename="output.txt"):


    with open(filename, "w") as file:
        file.write(text)
    print(f"Text dumped to file '{filename}' successfully!")



# Convert table into the appropriate format
def table_converter(table):
    logger.info("Converting table into appropriate format")
    table_string = ''
    # Iterate through each row of the table
    for row_num in range(len(table)):
        row = table[row_num]
        # Remove the line breaker from the wrapped texts
        cleaned_row = [item.replace('\n', ' ') if item is not None and '\n' in item else 'None' if item is None else item for item in row]
        # Convert the table into a string
        table_string+=('|'+'|'.join(cleaned_row)+'|'+'\n')
    # Removing the last line break
    table_string = table_string[:-1]
    return table_string

async def extract_tables_as_lists(pdf_buffer: BytesIO):
    logger.info("Extracting table content")
    formatted_table = []
    with pdfplumber.open(pdf_buffer) as pdf:
        logger.info('processing PDF tables')
        for page in pdf.pages:
            logger.info('process PDF page')
            extracted_tables = page.extract_tables()
            logger.info('extracted tables')
            for table in extracted_tables:
              #print ("TABLE :",table)
              table_str = table_converter(table)
              formatted_table.append(table_str)
              #tables.append(table)  # Append the table (list of rows)
    return formatted_table

def extract_text_from_pdf(pdf_bytes):
    # Convert PDF pages to images
    logger.info("Extracting text from PDF using OCR")
    pages = convert_from_bytes(pdf_bytes)

    # Create a directory to store temporary images
    temp_image_dir = "temp_images"
    os.makedirs(temp_image_dir, exist_ok=True)

    # Iterate through pages and extract text
    extracted_text = ""
    for i, page in enumerate(pages):
        # Save the page as a temporary image
        image_path = os.path.join(temp_image_dir, f"page_{i}.png")
        page.save(image_path, "PNG")

        # Perform OCR on the image
        text = pytesseract.image_to_string(Image.open(image_path))

        # Append the extracted text to the result
        extracted_text += text.strip() + "\n"

        # Remove the temporary image
        os.remove(image_path)

    # Remove the temporary image directory
    os.rmdir(temp_image_dir)

    return extracted_text