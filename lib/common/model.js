// @flow

export type HalLink = {
   href: string,
   templated?: boolean,
   rel?: string
};

export type HalLinkMap< Keys = string > = {
   self: HalLink,
   [ key: Keys ]: HalLink | HalLink[]
};

export type ApiRootModel = {
   _links: HalLinkMap< 'events' | 'documents' >
};

export type DocumentListModel = {
   _links: HalLinkMap< 'items' >,
   _embedded: {
      items: DocumentModel[]
   }
};

export type DocumentModel = {
   _links: HalLinkMap<>,
   nonce: string,
   name: string,
   time: number,
   data: DataItemModel[]
};

export type DataItemModel = {
   _links: HalLinkMap<>,
   type: string
};
