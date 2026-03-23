#include<iostream>
#include<algorithm>
#include<vector>
using namespace std;

int main()
{
    vector<int> arr;
    arr.push_back(10);
    arr.push_back(20);
    arr.push_back(30);
    arr.push_back(40);
    arr.push_back(50);

    int target =40;

    /*
    auto it = lower_bound(arr.begin(), arr.end(), 40);
    cout<<*it<<endl; //->40
    */

    //upper-bound
    /*
    auto it = upper_bound(arr.begin(), arr.end(), 40);
    cout<<*it<<endl;
    */

    //min-max in range
    auto it = min_element(arr.begin(),arr.end());
    cout<<*it<<endl;
    //auto it = max_element(arr.begin(),arr.end());
    //cout<<*it<<endl;

    //bool it = binary_search(arr.begin(), arr.end(),target);
    //cout<<it<<endl;
    return 0;
}