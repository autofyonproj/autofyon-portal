UPDATE sections
   SET options = '{"markets":["automotive"],"component":"network_tree","relationship":[{"relation":"represented_by","direction":"out","as":"cards"},{"relation":"distributed_by","direction":"out","as":"cards"},{"relation":"sold_by","direction":"out","as":"cards"},{"relation":"serviced_by","direction":"out","as":"cards"},{"relation":"children","direction":"out","as":"tree"}]}'
 WHERE id = 'sec_auto_network';
