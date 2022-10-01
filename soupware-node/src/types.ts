import { SEND_NODE, RECV_NODE } from './constants';

export type NodeKind = typeof SEND_NODE | typeof RECV_NODE;
