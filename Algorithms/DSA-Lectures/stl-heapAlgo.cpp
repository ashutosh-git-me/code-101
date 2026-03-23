#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;

int main()
{
    vector<int> arr;\
    arr.push_back(22);
    arr.push_back(11);
    arr.push_back(55);
    arr.push_back(66);
    arr.push_back(77);

    make_heap(arr.begin(), arr.end());

    for(int a:arr){
        cout<<a<<" ";
    }cout<<endl;

    arr.push_back(44);//heap break
    push_heap(arr.begin(), arr.end());//imp

    //delete
    pop_heap(arr.begin(),arr.end());//valid-heap and extra element @end 
    arr.pop_back();

    for(int a:arr){
        cout<<a<<" ";
    }cout<<endl;

    sort_heap(arr.begin(), arr.end());
    for(int a:arr){
        cout<<a<<" ";
    }cout<<endl;



    return 0;
}