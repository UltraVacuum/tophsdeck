import random
import os
from concurrent.futures import ThreadPoolExecutor
from datasets import Dataset
import openai

random.seed(42)

# get directory of file
current_file_path = os.path.abspath(__file__)
current_directory = os.path.dirname(current_file_path)

# 00, 10, 11, 20, 22, 30, 33, 40, 44, ..., e0, ee, f0, ff
octets = list(range(16, 256, 16)) + [i*16+i for i in range(16)]
cache_dir = os.path.join(current_directory, "cache")


def generate_colors():
    colors = []
    for r in octets:
        for g in octets:
            for b in octets:
                hex_color = "%02x%02x%02x" % (r, g, b)
                random.seed(r << 16 + g << 8 + b)
                r_rand = r + random.randint(1, 15)
                g_rand = g + random.randint(1, 15)
                b_rand = b + random.randint(1, 15)
                hex_color_rand = "%02x%02x%02x" % (r_rand, g_rand, b_rand)
                colors.append(hex_color)
                if r%16==0 and g%16==0 and b%16==0 and r_rand <= 255 and g_rand <= 255 and b_rand <= 255:
                    colors.append(hex_color_rand)
    return colors


def get_color_description(color):
    sys = """You are an expert at translating between natural language and hex color codes.
    You will be asked to describe hex color codes.
    Always give answers just decribing the color, with no preamble, or query phrasing.
    Give a brief description, then a colon, then a longer description of about a line of text."""
    prompt = f"#{color}"
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": sys},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0]["message"]["content"].strip()


def process_color(color):
    cache_file = os.path.join(cache_dir, f"{color}.txt")
    if not os.path.exists(cache_file):
        description = get_color_description(color)
        print(f"{color} : {description}")
        # Save description to file
        with open(cache_file, "w") as f:
            f.write(description)


def prepare(output_file: str = "colors.jsonl"):
    colors = generate_colors()

    if not os.path.exists(cache_dir):
        os.makedirs(cache_dir)

    with ThreadPoolExecutor(max_workers=32) as executor:
        executor.map(process_color, colors)

    data = []
    for color in colors:
        with open(os.path.join(cache_dir, f"{color}.txt"), "r") as f:
            desc = f.read().strip()
        data.append({"color": f"#{color}", "description": desc})
    data.sort(key=lambda x: x["color"])
    dataset = Dataset.from_dict(
        {
            "color": [item["color"] for item in data],
            "description": [item["description"] for item in data],
        }
    )
    dataset.to_json(output_file, orient="records", lines=True)


if __name__ == "__main__":
    import fire
    fire.Fire(prepare)
