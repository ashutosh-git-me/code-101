#include<iostream>
#include<algorithm>
#include<vector>
using namespace std;

void printDouble(int a){
    cout<<2*a<<" ";
}

bool checkEven(int a){
    return a%2==0;
}

int main()
{
    vector<int> arr(6);
    arr[0]=10;
    arr[1]=11;
    arr[2]=13;
    arr[3]=14;
    arr[4]=12;
    arr[5]=15;

    //for_each(arr.begin(), arr.end(), printDouble);

    /* find
    int target = 40;
    vector<int>::iterator it = find(arr.begin(), arr.end(), target);
    //auto it=find(arr.begin(), arr.end(), target);   
    cout<<*it<<endl;//0 for 400
    */

    //find_if
    /*
    auto it = find_if(arr.begin(), arr.end(),checkEven);
    cout<<*it<<endl;
    */


    //count
    //int ans =count(arr.begin(), arr.end(), 20);
    //cout<<ans<<endl;

    //count_if
    int ans =count_if(arr.begin(), arr.end(), checkEven);
    cout<<ans<<endl;

    //sort
    /*
    sort(arr.begin(), arr.end());

    for(int a: arr){
        cout<<a<<" ";
    }cout<<endl;
    */


    //reverse
    /*
    reverse(arr.begin(), arr.end());
    for(int a: arr){
        cout<<a<<" ";
    }cout<<endl;
    */

    //rotate
    /*
    rotate(arr.begin(), arr.begin()+3, arr.end());
    for(int a: arr){
        cout<<a<<" ";
    }cout<<endl;
    */

    //unique and suplicates separated
    /*
    auto it = unique(arr.begin(), arr.end());
    arr.erase(it, arr.end());
    for(int a: arr){
        cout<<a<<" ";
    }cout<<endl;
    */

    auto it = partition(arr.begin(), arr.end(), checkEven);
    
    for(int a: arr){
        cout<<a<<" ";
    }cout<<endl;

    return 0;
}