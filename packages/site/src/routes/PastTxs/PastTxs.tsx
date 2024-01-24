import {NetworkKeys, NetworksConfig} from 'common';
import {EntryPoint} from 'contracts';
import {useEffect, useState} from 'react';
import cx from 'classnames';
import {Link, useParams} from 'react-router-dom';
import {useClient} from 'wagmi';
import {getAbiItem, FormattedTransaction, Log} from 'viem';
import {getLogs, getBlockNumber, getTransaction} from 'viem/actions';
import {Button, Surface, PageContainer, ActivityIndicator, NetworkButton} from '../../components';
import {NetworksLogos} from '../../assets/NetworksLogos';
import {Paths} from '../Paths';

import './styles.scss';

const blocksPerBatch = 2000;
const batchSize = 5;

const PastTxs: React.FC = () => {
  const {address} = useParams();

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkKeys | null>(null);
  const [lastBlock, setLastBlock] = useState(-1);
  const [emptyBlocks, setEmptyBlocks] = useState(0);
  const [pastEvents, setPastEvents] = useState<{log: Log; tx: FormattedTransaction}[]>([]);

  const client = useClient({
    chainId: NetworksConfig[selectedNetwork as NetworkKeys]?.id,
  });

  const defaultBlockExplorer = client.chain.blockExplorers?.default?.url;

  const getPastEvents = async (
    from: number,
    to: number,
  ): Promise<null | {log: Log; tx: FormattedTransaction}[]> => {
    if (!address) return null;

    const eventAbi = getAbiItem({
      abi: EntryPoint,
      name: 'UserOperationEvent',
    });
    if (eventAbi?.type !== 'event') return null;

    const events = await getLogs(client, {
      event: eventAbi,
      fromBlock: BigInt(from),
      toBlock: BigInt(to),
      args: {
        sender: address,
      },
    });

    return Promise.all(
      events.map(async (event) => ({
        log: event,
        tx: (await getTransaction(client, {
          hash: event.transactionHash,
        })) as FormattedTransaction,
      })),
    );
  };

  const loadMore = async () => {
    if (!selectedNetwork) return;

    setLoading(true);

    const newEvents = (
      await Promise.all(
        Array.from({length: batchSize}).map(async (_, i) =>
          getPastEvents(lastBlock - (i + 1) * blocksPerBatch, lastBlock - i * blocksPerBatch),
        ),
      )
    )
      .flat()
      .filter(<T,>(e: T): e is NonNullable<T> => e !== null);

    if (newEvents.length === 0) {
      setEmptyBlocks(emptyBlocks + batchSize * blocksPerBatch);
    } else {
      setEmptyBlocks(0);
      setPastEvents([...pastEvents, ...newEvents]);
    }

    setLastBlock(lastBlock - batchSize * blocksPerBatch);
    setLoading(false);
  };

  useEffect(() => {
    if (!selectedNetwork) return;

    (async () => {
      setLoading(true);

      const blockNumber = Number(await getBlockNumber(client));

      setEmptyBlocks(0);
      setPastEvents([]);
      setLastBlock(blockNumber);
      setInitialized(false);
      setLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNetwork]);

  useEffect(() => {
    if (initialized) return;

    loadMore();
    setInitialized(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  return (
    <PageContainer className={cx('p-past-txs')}>
      <PageContainer.Card title="Past Transactions" className="d-flex f-dir-col">
        <h3 className="mb-0">Filter by chain</h3>
        <div className="p-past-txs_networks">
          {NetworkKeys.map((key) => {
            const network = NetworksConfig[key];
            const logo = NetworksLogos[key];

            return (
              <NetworkButton
                key={key}
                left={<logo.square.component height={logo.square.preferredHeight} />}
                active={selectedNetwork === key}
                disabled={loading}
                onClick={() => setSelectedNetwork(key)}
              >
                {network.name}
              </NetworkButton>
            );
          })}
        </div>

        <div className="p-past-txs_list">
          {pastEvents.map((event) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isSuccessful = (event.log as any)?.args?.success;

            return (
              <Surface
                key={event.log.transactionHash}
                className={cx('p-past-txs_list_card', {
                  'p-past-txs_list_card--success': isSuccessful === true,
                  'p-past-txs_list_card--error': isSuccessful === false,
                })}
              >
                <div className="d-flex align-center">
                  <div className="d-flex flex-1 f-dir-col">
                    <span>Hash: {event.tx.hash}</span>
                    <span>Block: {event.tx.blockNumber?.toString()}</span>
                    <span>{isSuccessful ? 'Successful' : 'Failed'}</span>
                  </div>

                  <div className="d-flex f-dir-col">
                    <Button
                      theme="rounded"
                      disabled={!defaultBlockExplorer}
                      as="a"
                      href={`${defaultBlockExplorer}/tx/${event.tx.hash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on Block Explorer
                    </Button>
                  </div>
                </div>
              </Surface>
            );
          })}
        </div>

        <div className="d-flex align-center gap-5">
          <Button theme="chip" color="dark" as={Link} to={Paths.MySnaaps.MySnaaps}>
            Go to your Account
          </Button>

          <Button
            theme="chip"
            className="d-flex gap-2"
            disabled={loading || !selectedNetwork}
            onClick={loadMore}
          >
            {loading ? <ActivityIndicator size="small" /> : null} Load More Transactions
          </Button>

          {emptyBlocks > 0 ? (
            <span>There were no transactions in the last {emptyBlocks} blocks.</span>
          ) : null}
        </div>
      </PageContainer.Card>
    </PageContainer>
  );
};

export default PastTxs;
