import pandas as pd
import json
import os
import re
from datetime import datetime


# ==========================================
# FILE PATHS
# ==========================================

excel_file = "../CourseCoupon_Master.xlsx"

output_folder = "../data"


# Create data folder if missing

os.makedirs(
    output_folder,
    exist_ok=True
)



# ==========================================
# CREATE SLUG FUNCTION
# ==========================================

def create_slug(text):

    if pd.isna(text):
        return ""

    text = str(text).lower()

    text = re.sub(
        r'[^a-z0-9]+',
        '-',
        text
    )

    return text.strip("-")



# ==========================================
# READ EXCEL
# ==========================================

print("Reading Excel file...")


df = pd.read_excel(
    excel_file
)



# Remove empty rows

df = df.dropna(
    how="all"
)



# ==========================================
# COURSES JSON
# ==========================================

courses = []


for index, row in df.iterrows():


    course = {


        "id":
            int(row["ID"]),


        "title":
            str(row["Course Name"]),


        "description":
            str(row["Description"]),


        "rating":
            float(row["Rating"]),


        "duration":
            str(row["Duration"]),


        "affiliate_url":
            str(row["Affiliate Link"]),


        "image":
            str(row["Image"]),



        "trainer":
            str(row["Trainer"]),


        "trainer_slug":
            create_slug(
                row["Trainer Slug"]
                if not pd.isna(row["Trainer Slug"])
                else row["Trainer"]
            ),



        "category":
            str(row["Category"]),


        "category_slug":
            create_slug(
                row["Category Slug"]
                if not pd.isna(row["Category Slug"])
                else row["Category"]
            ),



        "language":
            str(row["Language"]),


        "language_slug":
            create_slug(
                row["Language Slug"]
                if not pd.isna(row["Language Slug"])
                else row["Language"]
            ),



        "coupon_code":
            str(row["Coupon Code"]),



        "students":
            str(row["Students"]),



        "reviews":
            str(row["Reviews"]),



        "last_updated":
            str(row["Last Updated"]),



        "status":
            str(row["Status"])

    }


    courses.append(course)



# Save courses.json

with open(

    f"{output_folder}/courses.json",

    "w",

    encoding="utf-8"

) as file:


    json.dump(

        courses,

        file,

        indent=4,

        ensure_ascii=False

    )



print("courses.json created")



# ==========================================
# TRAINERS JSON
# ==========================================

trainers = []


unique_trainers = df[
    [
        "Trainer",
        "Trainer Slug"
    ]
].drop_duplicates()



for _, row in unique_trainers.iterrows():


    trainers.append({

        "name":
            str(row["Trainer"]),


        "slug":
            create_slug(
                row["Trainer Slug"]
            )

    })



with open(

    f"{output_folder}/trainers.json",

    "w",

    encoding="utf-8"

) as file:


    json.dump(

        trainers,

        file,

        indent=4,

        ensure_ascii=False

    )



print("trainers.json created")



# ==========================================
# CATEGORIES JSON
# ==========================================

categories = []


unique_categories = df[
    [
        "Category",
        "Category Slug"
    ]
].drop_duplicates()



for _, row in unique_categories.iterrows():


    categories.append({

        "name":
            str(row["Category"]),


        "slug":
            create_slug(
                row["Category Slug"]
            )

    })



with open(

    f"{output_folder}/categories.json",

    "w",

    encoding="utf-8"

) as file:


    json.dump(

        categories,

        file,

        indent=4,

        ensure_ascii=False

    )



print("categories.json created")



# ==========================================
# LANGUAGES JSON
# ==========================================

languages = []


unique_languages = df[
    [
        "Language",
        "Language Slug"
    ]
].drop_duplicates()



for index, row in unique_languages.iterrows():


    languages.append({

        "id":
            index + 1,


        "name":
            str(row["Language"]),


        "slug":
            create_slug(
                row["Language Slug"]
            ),


        "description":
            f"{row['Language']} Udemy Courses",


        "image":
            f"assets/images/languages/{create_slug(row['Language'])}.png"

    })



with open(

    f"{output_folder}/languages.json",

    "w",

    encoding="utf-8"

) as file:


    json.dump(

        languages,

        file,

        indent=4,

        ensure_ascii=False

    )



print("languages.json created")



print("\n================================")
print("JSON Conversion Completed")
print("================================")