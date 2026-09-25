import MemberId from "../domain/MemberId";
import Penalty from "../domain/Penalty";
import { PenaltyRepositoryInterface } from "../domain/repositories/PenaltyRepository";

export class PenaltyRepository implements PenaltyRepositoryInterface {
    #penalties: Penalty[];
    constructor() {
        this.#penalties = new Array<Penalty>();
    }
    save(penalty: Penalty) {}
    async create(penalty: Penalty) {
        return this.#penalties.push(penalty);
    }
    async findByMemberId(memberId: MemberId) {
        return this.#penalties.filter(penalty =>
            penalty.memberId.equals(memberId),
        );
    }
}
