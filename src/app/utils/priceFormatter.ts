

export class PriceFormatter {

    // vn price format
  static formatPrice(price: number, currency: string = 'VND'): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
    }).format(price);
  }

  static formatPriceWithSymbol(price: number, symbol: string): string {
    return `${symbol}${price.toFixed(2)}`;
  }

  static formatPriceWithoutSymbol(price: number): string {
    return price.toFixed(2);
  }
}