import ccxt from "ccxt";

// Интерфейс для представления биржи
interface Exchange {
  id: string;
  name: string;
  url: string;
  version?: string;
}

// Интерфейс для представления пары (инструмента)
interface Instrument {
  symbol: string;
  baseAsset: string; // Базовый актив (монета)
  quoteAsset: string; // Котируемый актив (монета)
}

// Интерфейс для представления актива (монеты)
interface Asset {
  id: string;
  symbol: string;
  name: string;
}

// Пример использования ccxt для получения информации о бирже
async function getExchangeInfo(exchangeId: string): Promise<Exchange | null> {
  try {
    // const ccxt = await import('https://cdn.jsdelivr.net/npm/ccxt@latest/src');
    const exchange = new ccxt[exchangeId]();
    return {
      id: exchange.id,
      name: exchange.name,
      url: exchange.urls.www,
      version: exchange.version,
    };
  } catch (error) {
    console.error(`Ошибка при получении информации о бирже ${exchangeId}:`, error);
    return null;
  }
}

// Пример использования ccxt для получения списка доступных пар (инструментов) на бирже
async function getExchangeInstruments(exchangeId: string): Promise<Instrument[]> {
  console.log('getExchangeInstruments');
  try {
    // const ccxt = await import('https://cdn.jsdelivr.net/npm/ccxt@latest/src');
    const exchange = new ccxt[exchangeId]();
    const markets = await exchange.loadMarkets();
    console.log('getExchangeInstruments try before return');
    return Object.values(markets).map((market: any) => ({
      symbol: market.symbol,
      baseAsset: market.base,
      quoteAsset: market.quote,
    }));
  } catch (error) {
    console.error(`Ошибка при получении списка пар на бирже ${exchangeId}:`, error);
    return [];
  }
}

// Пример использования ccxt для получения списка доступных активов (монет) на бирже
async function getExchangeAssets(exchangeId: string): Promise<Asset[]> {
  try {
    // const ccxt = await import('https://cdn.jsdelivr.net/npm/ccxt@latest/src');
    const exchange = new ccxt[exchangeId]();
    const assets = await exchange.loadMarkets();
    const uniqueAssets: { [key: string]: Asset } = {};

    for (const market of Object.values(assets)) {
      uniqueAssets[market.base] = {
        id: market.baseId,
        symbol: market.base,
        name: market.base,
      };
      uniqueAssets[market.quote] = {
        id: market.quoteId,
        symbol: market.quote,
        name: market.quote,
      };
    }

    return Object.values(uniqueAssets);
  } catch (error) {
    console.error(`Ошибка при получении списка активов на бирже ${exchangeId}:`, error);
    return [];
  }
}

// Пример использования функций
(async () => {
  const exchangeId = 'binance'; // Замените на ID биржи, которую хотите исследовать
  const exchangeInfo = await getExchangeInfo(exchangeId);
  console.log('Информация о бирже:', exchangeInfo);

  console.log('before getExchangeInstruments');
  const instruments = await getExchangeInstruments(exchangeId);
  console.log('after getExchangeInstruments');
  console.log({instruments});
  console.log('Доступные пары (инструменты) на бирже:', instruments);

  const assets = await getExchangeAssets(exchangeId);
  console.log('Доступные активы (монеты) на бирже:', assets);
})();
