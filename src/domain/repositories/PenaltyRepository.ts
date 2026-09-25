import MemberId from "../MemberId";
import Penalty from "../Penalty";

export interface PenaltyRepositoryInterface {
    create: (penalty: Penalty) => void;
    findByMemberId: (id: MemberId) => Promise<Penalty[]>;
    save: (penalty: Penalty) => void;
}
