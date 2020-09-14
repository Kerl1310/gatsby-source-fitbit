import { ActivityLevelEntry } from './activity-level-entry'
import { HeartRateZone } from './heart-rate-zone'
import { ManualValueSpecifiedEntry } from './manual-value-specified-entry'
import { Source } from './source'

export interface Activity {
    active_duration: number,
    activity_level: ActivityLevelEntry[],
    activity_name: string,
    activity_type_id: 17589491,
    average_heart_rate: number,
    calories: number,
    calories_link: URL,
    distance: number,
    distance_unit: "Kilometer",
    duration: number,
    heart_rate_link: URL,
    heart_rate_zones: HeartRateZone[],
    last_modified: Date,
    log_id: 2067350363,
    log_type: "fitstar",
    manual_value_specified: ManualValueSpecifiedEntry,
    source: Source,
    speed: number,
    start_time: Date,
    steps: number
}