#include<iostream>
#include<algorithm>
#include<numeric>
#include<vector>
using namespace std;

int main()
{
    
    vector<int> arr(5);
    arr[0]=10;
    arr[1]=20;
    arr[2]=30;
    arr[3]=40;
    arr[4]=50;
    

    vector<int> first(4);
    first.push_back(1);
    first.push_back(2);
    first.push_back(3);
    first.push_back(4);

    vector<int> second(3);
    second.push_back(3);
    second.push_back(4);
    second.push_back(5);

    vector<int> num(10);

    iota(num.begin(), num.end(),100);
    for(int a:num){
        cout<<a<<" ";
    }cout<<endl;

    //sum
    /*
    int sum = accumulate(arr.begin(), arr.end(), 0);
    cout<<sum<<endl;
    */

    //inner_product
    /*
    int ans = inner_product(first.begin(), first.end(), second.begin(), 0);
    cout<<ans<<endl;
    */


    vector<int> result(arr.size());
    //partial_sum
    partial_sum(arr.begin(), arr.end(), result.begin());
    for(int a:result){
        cout<<a<<" ";
    }


    return 0;
}