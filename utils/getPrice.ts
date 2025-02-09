"use server";
import { readExcelFile } from "./readExcelFile";
import isNumeric from "validator/lib/isNumeric";

type PriceData = {
  price?: string | undefined;
  pricewithDiscount?: string | undefined;
  error?: {
    message: string;
  };
  maxMinMsg?: string;
};

type GetPriceProps = {
  width: string;
  height: string;
  type: string;
  discount?: string;
};

export async function getPrice({
  width,
  height,
  type,
  discount,
}: GetPriceProps): Promise<PriceData> {
  const isWidthNumbersOnly = isNumeric(width);
  const isHeightNumbersOnly = isNumeric(height);

  if (isWidthNumbersOnly && isHeightNumbersOnly) {
    const data = readExcelFile(type);
    const widthNumber = parseInt(width);
    const heightNumber = parseInt(height);

    let maxMinMsg: string | undefined;

    const maxMin = {
      width: {
        max: data.reduce((max, curr) => {
          if (curr.WIDTH >= max) return curr.WIDTH;
          return max;
        }, 0),
        min: data.reduce((min, curr) => {
          if (curr.WIDTH >= min.WIDTH) return min;
          return curr;
        }).WIDTH,
      },
      height: {
        max: Object.keys(data[0])
          .filter((key) => key !== "WIDTH")
          .reduce((max, curr) => {
            if (+curr >= max) return +curr;
            return max;
          }, 0),
        min: +Object.keys(data[0])[0],
      },
    };

    const widths = data.map((dataWidth) => {
      return dataWidth.WIDTH;
    });

    const closestWidth = closest(widths, widthNumber);

    if (widthNumber && heightNumber) {
      const findWidth = data.find((dataWidth) => {
        return dataWidth.WIDTH === closestWidth;
      });

      const heights = Object.keys(findWidth as {})
        .filter((height) => height !== "WIDTH")
        .map((height) => parseInt(height));

      const closestHeight = closest(heights, heightNumber);

      if (+width < maxMin.width.min) {
        maxMinMsg = `${
          maxMinMsg ?? ""
        }\nהרוחב שנתנת/ה הוא פחות מהמינימום לסוג הפרגולה הזאת (הרוחב המינימלי הוא: ${
          maxMin.width.min
        })`;
      }

      if (+height < maxMin.height.min) {
        maxMinMsg = `${
          maxMinMsg ?? ""
        }\nהגובה שנתנת/ה הוא פחות מהמינימום לסוג הפרגולה הזאת (הגובה המינימלי הוא: ${
          maxMin.height.min
        })`;
      }

      if (+width > maxMin.width.max) {
        maxMinMsg = `${
          maxMinMsg ?? ""
        }\nהרוחב שנתנת/ה הוא גדול מהמקסימום לסוג הפרגולה הזאת (הרוחב המקסימלי הוא: ${
          maxMin.width.max
        })`;
      }

      if (+height > maxMin.height.max) {
        maxMinMsg = `${
          maxMinMsg ?? ""
        }\nהגובה שנתנת/ה הוא גדול מהמקסימום לסוג הפרגולה הזאת (הגובה המקסימלי הוא: ${
          maxMin.height.max
        })`;
      }

      if (findWidth) {
        const unformattedPrice = findWidth[String(closestHeight)];

        if (unformattedPrice === 0) {
          return {
            error: {
              message: "אין מחיר במידות אלו",
            },
          };
        }

        const price = new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: "ILS",
        }).format(unformattedPrice);

        if (!discount) {
          return {
            price,
            ...(maxMinMsg ? { maxMinMsg } : {}),
          };
        }

        if (!isNumeric(discount)) {
          return {
            price,
            ...(maxMinMsg ? { maxMinMsg } : {}),
            error: {
              message: "אחוז הנחה חייב להיות מספרים בלבד",
            },
          };
        }

        const discountPercent: number = Number(discount);
        const discountedPrice =
          (unformattedPrice * (100 - discountPercent)) / 100;

        const pricewithDiscount = new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: "ILS",
        }).format(discountedPrice);

        return {
          price,
          pricewithDiscount,
          ...(maxMinMsg ? { maxMinMsg } : {}),
        };
      }
      return {
        error: {
          message: "מידע חייב להיות מספרים בלבד",
        },
      };
    }
  }

  return {
    error: {
      message: "מידע חייב להיות מספרים בלבד",
    },
  };
}

const closest = (arr: number[], number: number) =>
  arr.reduce((prev, curr) =>
    Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev
  );
