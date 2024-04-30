import { DefaultText } from '@components/common/DefaultText';
import { ObserverTrigger } from '@components/hoc/ObserverTrigger';
import styled from '@emotion/styled';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { FC } from 'react';
import getPartyJoin, { API_GET_PARTY_JOIN_KEY } from 'src/api/getPartyJoin';
import { PartyRequestRole } from './PartyRequest';
import PartyRequestCard from './PartyRequestCard';

interface PartyRequestItemListProps {
    role: PartyRequestRole;
}

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
`;

const PartyRequestItemList: FC<PartyRequestItemListProps> = ({ role }) => {
    const partyRequestList = useSuspenseInfiniteQuery({
        queryKey: [API_GET_PARTY_JOIN_KEY, { role }],
        queryFn: ({ pageParam = 0 }) =>
            getPartyJoin({
                page: pageParam,
                role,
                size: 5,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (!lastPage?.pageInfo.hasNext) {
                return undefined;
            }
            return lastPage.pageInfo.page + 1;
        },
    });
    const onObserve = () => {
        if (partyRequestList.hasNextPage) partyRequestList.fetchNextPage();
    };

    if (!partyRequestList.data.pages[0].partyList.length) {
        return (
            <Container>
                <DefaultText text="현재 조회된 파티가 없습니다." size={18} weight={700} />
            </Container>
        );
    }

    return (
        <ObserverTrigger onObserve={onObserve} observerMinHeight="30px">
            {partyRequestList.data.pages.map((request) =>
                request.partyList.map((individualRequest) => (
                    <PartyRequestCard
                        key={individualRequest.partyId}
                        data={individualRequest}
                        role={role}
                    />
                )),
            )}
        </ObserverTrigger>
    );
};

export default PartyRequestItemList;