import { createHash } from 'crypto';
import * as _ from 'lodash';

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  const hashData = (data) => createHash("sha3-512").update(data).digest("hex");

  if (event) {
    if (event.partitionKey) {
      let partitionKeyAsString = event.partitionKey

      if (!_.isString(partitionKeyAsString)) {
        partitionKeyAsString = JSON.stringify(partitionKeyAsString);
      }

      return (partitionKeyAsString.length <= MAX_PARTITION_KEY_LENGTH) ? partitionKeyAsString : hashData(partitionKeyAsString)
    } else {
      return hashData(JSON.stringify(event))
    }
  }

  return TRIVIAL_PARTITION_KEY;
};