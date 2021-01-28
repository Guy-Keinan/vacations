export class VacationModel {
    constructor(
        public vacationId?: number,
        public destination?: string,
        public description?: string,
        public dateFrom?: string,
        public dateTo?: string,
        public price?: number,
        public imageFile?: string,
    ) { }
};