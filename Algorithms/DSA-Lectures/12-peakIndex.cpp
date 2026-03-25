#include<iostream>
using namespace std;

int peak(int arr[], int n){
    int s=0, e=n-1;
    while(s<e){
        int mid=s+(e-s)/2;
        if(arr[mid]<arr[mid+1]){
            s=mid+1;
        }
        else e=mid;
    }
    return s;
}

int main()
{
    int arr[10]={1,4,7,17,12,11,9,9,6,1};
    cout<<peak(arr,10)<<endl;
    return 0;
}