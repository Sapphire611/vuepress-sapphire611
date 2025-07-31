const obj = {
  side_infos: {
    A: 'C:/minio/deepiresults/20250730/2i0040qwcnc00/A/20250730103123819431/20250730103123819431-panel.json',
    B: 'C:/minio/deepiresults/20250730/2i0040qwcnc00/B/20250730103357101818/20250730103357101818-panel.json',
  },
  sn: '2519518901 4114',
};

const output = {
  db_name: 'AVI_results_db',
  operation: 'put',
  op_mode: 'all_ow',
  key: obj.sn,
  value: JSON.stringify(obj),
};

console.log(JSON.stringify(output, null, 2));
