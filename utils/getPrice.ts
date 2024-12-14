"use server";
import { readExcelFile } from "./readExcelFile";
import isNumeric from "validator/lib/isNumeric";

type PriceData = {
  price?: string | undefined;
  discountedPrice?: string | undefined;
  error?: {
    message: string;
  };
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
          };
        }

        if (!isNumeric(discount)) {
          return {
            price,
            error: {
              message: "אחוז ההנחה חייב להיות מספרים בלבד",
            },
          };
        }

        const discountPercent = Number(discount);
        const priceAfterDiscount =
          unformattedPrice - unformattedPrice * (discountPercent / 100);

        const discountedPrice = new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: "ILS",
        }).format(priceAfterDiscount < 0 ? 0 : priceAfterDiscount);

        return {
          price,
          discountedPrice,
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
