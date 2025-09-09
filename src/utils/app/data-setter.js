import moment from 'moment';

export default{
    constants:{
        DATERANGE_MODE_MONTHLY : "monthly",
        DATERANGE_MODE_DAILY : "daily",
        DATERANGE_DIRECTION_THIS_POINT_FORWARD : "this point forward",
        DATERANGE_DIRECTION_BACKWARD : "backward"
    },
    setDateRange({
        mode,
        duration,
        direction
    })
    {
        if(mode === this.constants.DATERANGE_MODE_MONTHLY){
            let startDate = '';
            let endDate = '';
            if(direction === this.constants.DATERANGE_DIRECTION_THIS_POINT_FORWARD){    
                startDate = moment().startOf('month').format('YYYY-MM-DD');
                endDate = moment().add(duration - 1, 'months').endOf('month').format('YYYY-MM-DD');
            }
            else if(direction === this.constants.DATERANGE_DIRECTION_BACKWARD){
                startDate = moment().subtract(duration, 'months').startOf('month').format('YYYY-MM-DD');
                endDate = moment().subtract(1, "months").endOf('month').format('YYYY-MM-DD');
            }

            return {
                startDate,
                endDate
            }
        }
    },
    backOneMonth(dateRange){
        return {
            startDate: moment(dateRange.startDate).subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            endDate: moment(dateRange.startDate).subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
        }
    },
    forwardOneMonth(dateRange){
        return {
            startDate: moment(dateRange.startDate).add(1, 'month').startOf('month').format('YYYY-MM-DD'),
            endDate: moment(dateRange.startDate).add(1, 'month').endOf('month').format('YYYY-MM-DD')
        }
    }
}